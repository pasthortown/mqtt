<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\watherRequest;
use Illuminate\Support\Facades\Mail;
use App\User;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Picqer;
use Illuminate\Support\Facades\App;

class watherRequestController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(watherRequest::get(),200);
       } else {
          $watherrequest = watherRequest::findOrFail($id);
          $attach = [];
          return response()->json(["watherRequest"=>$watherrequest, "attach"=>$attach],200);
       }
    }

    function statistics(Request $data)
    {
       $result = DB::table('wather_requests')
                     ->select(DB::raw('user_id, activo, sum(quantity) as quantity_of_wather, count(*) as num_requests'))
                     ->groupBy('user_id', 'activo')
                     ->get();
       return response()->json($result,200);
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(watherRequest::paginate($size),200);
    }

    function paginate_my_requests(Request $data)
    {
       $user_id = $data['user_id'];
       $size = $data['size'];
       return response()->json(watherRequest::where('user_id', $user_id)->paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $watherrequest = new watherRequest();
          $lastwatherRequest = watherRequest::orderBy('id')->get()->last();
          if($lastwatherRequest) {
             $watherrequest->id = $lastwatherRequest->id + 1;
          } else {
             $watherrequest->id = 1;
          }
          $watherrequest->code = $result['code'];
          $watherrequest->quantity = $result['quantity'];
          $watherrequest->activo = $result['activo'];
          $watherrequest->user_id = $result['user_id'];
          $watherrequest->save();
          DB::commit();
          $user = User::findOrFail($result['user_id']);
          $subject = 'Código Recibido';
          $message = 'Gracias por adquirir '.$result['quantity'].' mL de agua.';
          $barcode = $this->getBarcode($result['code']);
          $code = $result['code'];
          $pdf_b64 = $this->buildPDF($user->name, $result['quantity'], $code, $barcode);
          $this->send_mail($user->email, $user->name, $subject, $message, env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'), $barcode, $code , $pdf_b64);
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($watherrequest,200);
    }

    function getBarcode($code) {
        $barcode_generator = new Picqer\Barcode\BarcodeGeneratorPNG();
        $barcode = $barcode_generator->getBarcode($code, $barcode_generator::TYPE_CODE_128, 2, 100, [0,0,0]);
        return base64_encode($barcode);
    }

    function buildPDF($user, $quantity, $code, $barcode) {
        $pdf_content = '<pagina>';
        $pdf_content .= '<div style="width:100%; height:350px;"></div>';
        $pdf_content .= '<div style="width:100%; margin-left: 150px; margin-right:100px;">';
        $pdf_content .= '<p>';
        $pdf_content .= 'Saludos, <strong>'.$user.'</strong><br/><br/>';
        $pdf_content .= '</p>';
        $pdf_content .= '<p>';
        $pdf_content .= 'Gracias por adquirir '.$quantity.' mL de agua.<br/><br/>';
        $pdf_content .= '</p>';
        $pdf_content .= '<p>';
        $pdf_content .= 'Su código es '.$code.'<br/>';
        $pdf_content .= '<img src="data:image/png;base64,'.$barcode.'"/>';
        $pdf_content .= '</p>';
        $pdf_content .= '<p>';
        $pdf_content .= 'Atentamente, <br/>';
        $pdf_content .= '<strong>Despacho de Agua</strong>';
        $pdf_content .= '</p>';
        $pdf_content .= '</div>';
        $pdf_content .= '</pagina>';
        $html = $this->sticker_style($pdf_content, $code, $barcode);
        $orientation = 'portrait';
        $pdf = App::make('dompdf.wrapper');
        $pdf->setPaper('A4', $orientation);
        $pdf->setOptions(['dpi' => 150, 'defaultFont' => 'courier']);
        $pdf->loadHTML($html);
        $bytes = $pdf->output();
        return base64_encode($bytes);
    }

    function sticker_style($content, $title, $barcode) {
        $html = '<html>';
        $html .= '   <head>';
        $html .= '      <style>';
        $html .= '         @page { margin: 0px 0px 0px 0px}';
        $html .= '         header { position: fixed; top: 0px; left: 0px; right: 0px; height: 300px; z-index: -1; }';
        $html .= '         footer { position: fixed; bottom: 0px; left: 0px; right: 0px; text-align: center; height: 175px; z-index: -1; }';
        $html .= '         p { word-spacing: 5px; width:100%; text-align:justify; }';
        $html .= '         pagina { page-break-after:always; z-index:1; }';
        $html .= '         pagina:last-child(page-break-after:never; z-index:1; }';
        $html .= '      </style>';
        $html .= '   </head>';
        $html .= '   <body>';
        $html .= '      <img style="position:fixed; left:50px; top:150px;" src="data:image/png;base64,'.$barcode.'"/>';
        $html .= '      <header>';
        $html .= '         <h2 style="position: fixed; left:0px; right:0px; top:250px; font-family: Arial, Helvetica, sans-serif; text-align:center;">'. $title .'</h2>';
        $html .= '      </header>';
        $html .= '      <footer>';
        $html .= '      </footer>';
        $html .= '      <main>';
        $html .= $content;
        $html .= '      </main>';
        $html .= '   </body>';
        $html .= '</html>';
        return $html;
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $watherrequest = watherRequest::where('id',$result['id'])->update([
             'code'=>$result['code'],
             'quantity'=>$result['quantity'],
             'activo'=>$result['activo'],
             'user_id'=>$result['user_id'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($watherrequest,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return watherRequest::destroy($id);
    }

    function backup(Request $data)
    {
       $watherrequests = watherRequest::get();
       $toReturn = [];
       foreach( $watherrequests as $watherrequest) {
          $attach = [];
          array_push($toReturn, ["watherRequest"=>$watherrequest, "attach"=>$attach]);
       }
       return response()->json($toReturn,200);
    }

    function code_used(Request $data)
    {
        $code = $data['code'];
        $watherrequest_back = watherRequest::where('code',$code)->first();
        if (!$watherrequest_back) {
            return response()->json(0,200);
        }
        try{
            DB::beginTransaction();
            $watherrequest = watherRequest::where('code',$code)->update([
               'activo'=>false,
            ]);
            DB::commit();
        } catch (Exception $e) {
            return response()->json(0,200);
        }
        if ($watherrequest_back->activo) {
            return response()->json($watherrequest_back->quantity,200);
        }
        return response()->json(0,200);
    }

    function masiveLoad(Request $data)
    {
      $incomming = $data->json()->all();
      $masiveData = $incomming['data'];
      try{
       DB::beginTransaction();
       foreach($masiveData as $row) {
         $result = $row['watherRequest'];
         $exist = watherRequest::where('id',$result['id'])->first();
         if ($exist) {
           watherRequest::where('id', $result['id'])->update([
             'code'=>$result['code'],
             'quantity'=>$result['quantity'],
             'activo'=>$result['activo'],
             'user_id'=>$result['user_id'],
           ]);
         } else {
          $watherrequest = new watherRequest();
          $watherrequest->id = $result['id'];
          $watherrequest->code = $result['code'];
          $watherrequest->quantity = $result['quantity'];
          $watherrequest->activo = $result['activo'];
          $watherrequest->user_id = $result['user_id'];
          $watherrequest->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }

    protected function send_mail($to, $toAlias, $subject, $body, $fromMail, $fromAlias, $barcode, $code, $pdf) {
        $data = ['name'=>$toAlias, 'body'=>$body, 'barcode'=>$barcode, 'code'=>$code, 'appName'=>env('MAIL_FROM_NAME')];
        Mail::send('barcode', $data, function($message) use ($to, $toAlias, $subject, $fromMail,$fromAlias, $code, $pdf) {
          $message->to($to, $toAlias)->subject($subject);
          $message->from($fromMail,$fromAlias);
          $message->attachData(base64_decode($pdf), $code.'.pdf', ['mime' => 'application/pdf']);
        });
        return response()->json("Success!",200);
    }
}
