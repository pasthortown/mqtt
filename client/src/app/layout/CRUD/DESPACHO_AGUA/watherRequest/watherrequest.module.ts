import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { watherRequestRoutingModule } from './watherrequest-routing.module';
import { watherRequestComponent } from './watherrequest.component';
import { watherRequestService } from './../../../../services/CRUD/DESPACHO_AGUA/watherrequest.service';
import { environment } from 'src/environments/environment';
import { UserService } from './../../../../services/profile/user.service';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { ChartsModule } from 'ng2-charts';

@NgModule({
   imports: [CommonModule,
             watherRequestRoutingModule,
             FormsModule,
             ChartsModule,
             NgxBarcode6Module],
   declarations: [watherRequestComponent],
   providers: [
               UserService,
               watherRequestService
               ]
})
export class watherRequestModule {}