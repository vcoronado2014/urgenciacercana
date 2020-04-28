import { Component, OnInit } from '@angular/core';
import { Platform, NavController, NavParams, ModalController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { ServicioUtiles } from '../services/ServicioUtiles';

@Component({
  selector: 'app-modal-vista',
  templateUrl: './modal-vista.page.html',
  styleUrls: ['./modal-vista.page.scss'],
})
export class ModalVistaPage implements OnInit {
  plataforma;
	versionAppName;
  versionNumber;
  infoAplicacion: any;

  isDevice = false;
  token: any;
  plataformaL: any;


  constructor(
    public modalCtrl: ModalController,
    public platform: Platform,
    private appVersion: AppVersion,
    public utiles: ServicioUtiles,
  ) { }

  ngOnInit() {
    if (this.utiles.isAppOnDevice()){
      this.isDevice = true;
      this.getVersionNumber();
      this.token = localStorage.getItem("token_dispositivo");
    }
    else{
      this.versionAppName = "mi urgencia cercana"
      this.versionNumber = "0.0";
      this.plataforma = "Web";
    }
    
    //this.infoAplicacion = this.utiles.getVersionNumber();
  }

  async getVersionNumber() {

    if (this.platform.is('ios')){
      this.versionAppName = await this.appVersion.getAppName();
      this.versionNumber = await this.appVersion.getVersionNumber();
      this.plataforma = "iOS";
    } 
    else if (this.platform.is('android')){
      this.versionAppName = await this.appVersion.getAppName();
      this.versionNumber = await this.appVersion.getVersionNumber();
      this.plataforma = "Android";
    }
    else if (this.platform.is('mobileweb')){
      this.versionAppName = "mi urgencia cercana"
      this.versionNumber = "0.0";
      this.plataforma = "Web";
    }
    else {
      this.versionAppName = "mi urgencia cercana"
      this.versionNumber = "0.0";
      this.plataforma = "No informado";
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
