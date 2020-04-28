import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule } from '@angular/router';

import { GravedadPage } from './gravedad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'gravedad',
        component: GravedadPage
      }
    ])
  ],
  declarations: [GravedadPage]
})
export class GravedadPageModule {}
