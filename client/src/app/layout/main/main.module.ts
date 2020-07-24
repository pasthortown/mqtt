import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { FormsModule } from '@angular/forms';
import { watherRequestService } from './../../services/CRUD/DESPACHO_AGUA/watherrequest.service';
import { environment } from 'src/environments/environment';
import { NgxBarcode6Module } from 'ngx-barcode6';

@NgModule({
    imports: [CommonModule,
        MainRoutingModule,
        FormsModule,
        NgxBarcode6Module],
    declarations: [MainComponent],
    providers: [
          watherRequestService
    ]
})
export class MainModule {}
