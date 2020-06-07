import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule } from '@angular/router';

import { DetallePropagandaPage } from './detalle-propaganda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'detalle-propaganda',
        component: DetallePropagandaPage
      }
    ])
  ],
  declarations: [DetallePropagandaPage]
})
export class DetallePropagandaPageModule {}
