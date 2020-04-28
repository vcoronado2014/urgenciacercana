import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, ToastController   } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {

  constructor(
    private ref: ChangeDetectorRef,
    private toast: ToastController,
    public geolocation: Geolocation,
    public navCtrl: NavController,
  ) { 
    //Funcion que detecta los cambios de las variables
    setInterval(() => {
      this.ref.detectChanges();
    }, 100);
  }

  ngOnInit() {
  }
  async verMapaConConexion() {
  
    if(localStorage.getItem("conexion") == 'offline' || localStorage.getItem("latitud") == null){
      this.geolocation.getCurrentPosition().then((resp) => {
/*         localStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
        localStorage.setItem("longitud", JSON.stringify(resp.coords.longitude)); */
        sessionStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
        sessionStorage.setItem("longitud", JSON.stringify(resp.coords.longitude));
      }).catch((error) => {
        console.log('Error getting location', error);
      })

      let toast = await this.toast.create({
        message: `Sigues sin conexión a internet, o no has compatido tu ubicación. Si el problema persiste reinicia la aplicación`,
        duration: 3000
      });
      return toast.present();
    }else{
      this.navCtrl.navigateForward('mapa-test');
    }
  }

}
