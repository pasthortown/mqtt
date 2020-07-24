import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { watherRequestComponent } from './watherrequest.component';

const routes: Routes = [
   {
      path: '',
      component: watherRequestComponent
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class watherRequestRoutingModule {}
