import { Component, OnInit } from '@angular/core';
import { Platform, NavController, NavParams, ModalController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

import { ServicioUtiles } from '../services/ServicioUtiles';

@Component({
  selector: 'app-detalle-propaganda',
  templateUrl: './detalle-propaganda.page.html',
  styleUrls: ['./detalle-propaganda.page.scss'],
})
export class DetallePropagandaPage implements OnInit {
  options: InAppBrowserOptions = {
    location: 'yes',
  };

  objetoPropaganda: any;
  
  constructor(
    public modalCtrl: ModalController,
    public platform: Platform,
    private appVersion: AppVersion,
    public utiles: ServicioUtiles,
    public inap: InAppBrowser,
    public nav: NavParams
  ) { 

  }

  ngOnInit() {
    //mostrar la info en este caso el flayer
    if (this.nav.data && this.nav.data.propaganda){
      this.objetoPropaganda = this.nav.data.propaganda;
      console.log(this.objetoPropaganda)
    }

  }
  abrirUrl(){
    if (this.objetoPropaganda && this.objetoPropaganda.PaginaWeb != '#' && this,this.objetoPropaganda.PaginaWeb != ''){
      if (this.utiles.isAppOnDevice()){
        //usamos inap browser
        let target = "_system";
        this.inap.create(encodeURI(this.objetoPropaganda.PaginaWeb), target, this.options);
      }
      else {
        //web
        window.open(encodeURI(this.objetoPropaganda.PaginaWeb), "_system", "location=yes");
      }
    }
  }
  dismiss() {
    this.modalCtrl.dismiss(
      {
        'dismissed': true
      }
    );
  }

}
