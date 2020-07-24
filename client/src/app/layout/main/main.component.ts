import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { saveAs } from 'file-saver/FileSaver';
import { watherRequestService } from './../../services/CRUD/DESPACHO_AGUA/watherrequest.service';
import { watherRequest } from './../../models/DESPACHO_AGUA/watherRequest';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
    wather_requests: watherRequest[] = [];
    wather_requestSelected: watherRequest = new watherRequest();

    currentPage = 1;
    lastPage = 1;
    showDialog = false;
    recordsByPage = 5;
    bctype = 'CODE128';
    userData = null;

    constructor(private toastr: ToastrManager,
        private wather_requestDataService: watherRequestService) {}

    ngOnInit() {
        this.userData = JSON.parse(sessionStorage.getItem('user'));
        this.goToPage(1);
    }

    selectwatherRequest(wather_request: watherRequest) {
        this.wather_requestSelected = wather_request;
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
        this.wather_requestSelected.user_id = this.userData.id;
        this.wather_requestDataService.get_paginate_my_requests(this.recordsByPage, this.currentPage, this.userData.id).then( r => {
           this.wather_requests = r.data as watherRequest[];
           this.lastPage = r.last_page;
        }).catch( e => console.log(e) );
    }
  
    newwatherRequest() {
        this.wather_requestSelected = new watherRequest();
        this.wather_requestSelected.user_id = this.userData.id;
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
