import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { watherRequestService } from './../../../../services/CRUD/DESPACHO_AGUA/watherrequest.service';
import { watherRequest } from './../../../../models/DESPACHO_AGUA/watherRequest';
import { UserService } from './../../../../services/profile/user.service';
import { User } from './../../../../models/profile/User';


@Component({
   selector: 'app-watherrequest',
   templateUrl: './watherrequest.component.html',
   styleUrls: ['./watherrequest.component.scss']
})
export class watherRequestComponent implements OnInit {
   wather_requests: watherRequest[] = [];
   wather_requestSelected: watherRequest = new watherRequest();

   currentPage = 1;
   lastPage = 1;
   showDialog = false;
   recordsByPage = 5;
   users: User[] = [];
   bctype = 'CODE128';

   public barChartData: any[] = [
      { data: [0], label: 'Activo' },
      { data: [0], label: 'Usado' }
   ];

   public barChartData2: any[] = [
      { data: [0], label: 'Activo' },
      { data: [0], label: 'Usado' }
   ];

   public barChartType: string  = 'bar';
   public barChartLabels: string[] = [
      ''
   ];

   public barChartOptions: any = {
      scaleShowVerticalLines: false,
      responsive: true
   };

   public barChartLegend: boolean = true;

   constructor(
               private toastr: ToastrManager,
               private userDataService: UserService,
               private wather_requestDataService: watherRequestService) {}

   ngOnInit() {
      this.goToPage(1);
      this.getUser();
   }

   getStatistics() {
      this.wather_requestDataService.get_statistics().then( r => {
         this.barChartLabels = [''];
         const data_activo = {data: [0], label:'Activo'};
         const data_usado = {data: [0], label:'Usado'};
         const data_activo_pedidos = {data: [0], label:'Activo'};
         const data_usado_pedidos = {data: [0], label:'Usado'};
         const sorted_array_data = [];
         const sorted_data = {label: '', quantity_active: 0, quantity_used: 0, requests_active: 0, requests_used: 0};
         const incomming_data = r;
         incomming_data.forEach(element => {
            let user_of_element = null;
            this.users.forEach(user => {
               if (element.user_id == user.id) {
                  user_of_element = user;
               }
            });
            let existe = false;
            sorted_array_data.forEach(row => {
               if (row.label == user_of_element.name) {
                  existe = true;
                  if (element.activo) {
                     row.quantity_active = element.quantity_of_wather;
                     row.requests_active = element.num_requests;
                  } else {
                     row.quantity_used = element.quantity_of_wather;
                     row.requests_used = element.num_requests;
                  }
               }
            });
            if (!existe) {
               if (element.activo) {
                  sorted_array_data.push({label: user_of_element.name, quantity_active: element.quantity_of_wather, quantity_used: 0, requests_active: element.num_requests, requests_used: 0});
               } else {
                  sorted_array_data.push({label: user_of_element.name, quantity_active: 0, quantity_used: element.quantity_of_wather, requests_active: 0, requests_used: element.num_requests});
               }               
            }
         });
         sorted_array_data.forEach(row => {
            this.barChartLabels.push(row.label);
            data_activo.data.push(row.quantity_active);
            data_usado.data.push(row.quantity_used);
            data_activo_pedidos.data.push(row.requests_active);
            data_usado_pedidos.data.push(row.requests_used);
         });
         this.barChartData = [data_activo, data_usado];
         this.barChartData2 = [data_activo_pedidos, data_usado_pedidos];
      }).catch( e => { console.log(e); });
   }

   selectwatherRequest(wather_request: watherRequest) {
      this.wather_requestSelected = wather_request;
   }

   getUser() {
      this.users = [];
      this.userDataService.get().then( r => {
         this.users = r as User[];
         this.getStatistics();
      }).catch( e => console.log(e) );
   }

   goToPage(page: number) {
      if ( page < 1 || page > this.lastPage ) {
         this.toastr.errorToastr('La página solicitada no existe.', 'Error');
         return;
      }
      this.currentPage = page;
      this.getwatherRequests();
   }

   getwatherRequests() {
      this.wather_requests = [];
      this.wather_requestSelected = new watherRequest();
      this.wather_requestSelected.user_id = 0;
      this.wather_requestDataService.get_paginate(this.recordsByPage, this.currentPage).then( r => {
         this.wather_requests = r.data as watherRequest[];
         this.lastPage = r.last_page;
      }).catch( e => console.log(e) );
   }

   newwatherRequest() {
      this.wather_requestSelected = new watherRequest();
      this.wather_requestSelected.user_id = 0;
      this.wather_requestSelected.code = this.getUniqueId(8);
      this.showDialog = true;
   }

   editwatherRequest() {
      if (typeof this.wather_requestSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.showDialog = true;
   }

   deletewatherRequest() {
      if (typeof this.wather_requestSelected.id === 'undefined') {
         this.toastr.errorToastr('Debe seleccionar un registro.', 'Error');
         return;
      }
      this.wather_requestDataService.delete(this.wather_requestSelected.id).then( r => {
         this.toastr.successToastr('Registro Borrado satisfactoriamente.', 'Borrar');
         this.getwatherRequests();
      }).catch( e => console.log(e) );
   }

   toCSV() {
      this.wather_requestDataService.get().then( r => {
         const backupData = r as watherRequest[];
         let output = 'id;code;quantity;user_id\n';
         backupData.forEach(element => {
            output += element.id + ';' + element.code + ';' + element.quantity + ';' + element.user_id + '\n';
         });
         const blob = new Blob([output], { type: 'text/plain' });
         const fecha = new Date();
         saveAs(blob, fecha.toLocaleDateString() + '_watherRequests.csv');
      }).catch( e => console.log(e) );
   }

   saveDialogResult() {
      if (typeof this.wather_requestSelected.id === 'undefined') {
         this.wather_requestDataService.post(this.wather_requestSelected).then( r => {
            this.toastr.successToastr('Datos guardados satisfactoriamente.', 'Nuevo');
            window.location.reload();
         }).catch( e => console.log(e) );
      } else {
         this.wather_requestDataService.put(this.wather_requestSelected).then( r => {
            this.toastr.successToastr('Registro actualizado satisfactoriamente.', 'Actualizar');
            window.location.reload();
         }).catch( e => console.log(e) );
      }
   }

   cancelDialogResult() {
      this.showDialog = false;
      this.goToPage(this.currentPage);
   }

   getUniqueId(parts: number): string {
      const stringArr = [];
      for(let i = 0; i< parts; i++){
        const S4 = Math.floor(Math.random()*9).toString();
        stringArr.push(S4);
      }
      return stringArr.join('');
   }
}