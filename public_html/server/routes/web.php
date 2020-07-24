<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
   return 'Web Wervice Realizado con LSCodeGenerator';
});

$router->group(['middleware' => []], function () use ($router) {
   $router->post('/login', ['uses' => 'AuthController@login']);
   $router->post('/register', ['uses' => 'AuthController@register']);
   $router->post('/password_recovery_request', ['uses' => 'AuthController@passwordRecoveryRequest']);
   $router->get('/password_recovery', ['uses' => 'AuthController@passwordRecovery']);
   $router->get('/code_used', ['uses' => 'watherRequestController@code_used']);
});

$router->group(['middleware' => ['auth']], function () use ($router) {
   $router->post('/user/password_change', ['uses' => 'AuthController@passwordChange']);


   //despacho_agua

   //CRUD ProfilePicture
   $router->post('/profilepicture', ['uses' => 'ProfilePictureController@post']);
   $router->get('/profilepicture', ['uses' => 'ProfilePictureController@get']);
   $router->get('/profilepicture/paginate', ['uses' => 'ProfilePictureController@paginate']);
   $router->put('/profilepicture', ['uses' => 'ProfilePictureController@put']);
   $router->delete('/profilepicture', ['uses' => 'ProfilePictureController@delete']);

   //CRUD User
   $router->post('/user', ['uses' => 'UserController@post']);
   $router->get('/user', ['uses' => 'UserController@get']);
   $router->get('/user/paginate', ['uses' => 'UserController@paginate']);
   $router->put('/user', ['uses' => 'UserController@put']);
   $router->delete('/user', ['uses' => 'UserController@delete']);

   //CRUD watherRequest
   $router->post('/watherrequest', ['uses' => 'watherRequestController@post']);
   $router->get('/watherrequest', ['uses' => 'watherRequestController@get']);
   $router->get('/watherrequest/statistics', ['uses' => 'watherRequestController@statistics']);
   $router->get('/watherrequest/paginate', ['uses' => 'watherRequestController@paginate']);
   $router->get('/watherrequest/paginate_my_requests', ['uses' => 'watherRequestController@paginate_my_requests']);
   $router->get('/watherrequest/backup', ['uses' => 'watherRequestController@backup']);
   $router->put('/watherrequest', ['uses' => 'watherRequestController@put']);
   $router->delete('/watherrequest', ['uses' => 'watherRequestController@delete']);
   $router->post('/watherrequest/masive_load', ['uses' => 'watherRequestController@masiveLoad']);
});
