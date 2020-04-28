import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RouterModule } from '@angular/router';

import { MapaTestPage } from './mapa-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'mapa-test',
        component: MapaTestPage
      }
    ])
  ],
  declarations: [MapaTestPage]
})
export class MapaTestPageModule {}
