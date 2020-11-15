import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, ToastController   } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//router
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
})
export class ErrorPage implements OnInit {
  
  paginaOrigen: string = '';

  constructor(
    private ref: ChangeDetectorRef,
    private toast: ToastController,
    public geolocation: Geolocation,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    //Funcion que detecta los cambios de las variables
/*     setInterval(() => {
      this.ref.detectChanges();
    }, 100); */
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.paginaOrigen = params.nombre;
    });
  }
  async verMapaConConexion() {
    if (this.paginaOrigen == 'login' || this.paginaOrigen == 'home'){
      var revisar = {
        valor: true
      }
      this.navCtrl.navigateForward(this.paginaOrigen, { queryParams: revisar }  );
    }
    else {
      if(localStorage.getItem("conexion") == 'offline' || localStorage.getItem("latitud") == null){
        this.geolocation.getCurrentPosition({maximumAge: 0, enableHighAccuracy: true}).then((resp) => {
          sessionStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
          sessionStorage.setItem("longitud", JSON.stringify(resp.coords.longitude));
        }).catch((error) => {
          console.log('Error getting location', error);
        })
  
        let toast = await this.toast.create({
          message: `Sigues sin conexión a internet, no has compatido tu ubicación, o la aplicación no tiene permisos. Si el problema persiste reinicia la aplicación`,
          duration: 3000
        });
        return toast.present();
      }else{
        this.navCtrl.navigateForward('mapa-test');
      }
    }

  }

}
