import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModalVistaPage } from './modal-vista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'modal-vista',
        component: ModalVistaPage
      }
    ])
    //ModalVistaPageRoutingModule

  ],
  declarations: [ModalVistaPage]
})
export class ModalVistaPageModule {}
