import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, Platform, ModalController, LoadingController } from '@ionic/angular';

//modal
import { ModalVistaPage } from '../modal-vista/modal-vista.page';
//plugin
import { Network } from '@ionic-native/network/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { HTTP } from '@ionic-native/http/ngx';
//servicios
import { ServicioUtiles } from '../../app/services/ServicioUtiles';
import { ServicioGeo } from '../../app/services/ServicioGeo';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  tokenDispositivo: any;
  subscription: any;
  esIOS = false;
  //navigator = {app: any};
  objetoEntrada = {
    VersionAppName: '',
    Plataforma: '',
    Token: '',
    VersionAppNumber: '',
    Fecha: new Date()
  };
  //quitar esto despues
arrPruebasLatLon =[
  //pasaje las estacas temuco
  { Lat: '-38.7665599', Lon: '-72.7686996' },
  //osorno -40.590819, -73.100826
  { Lat: '-40.590819', Lon: '-73.100826' },
  //estos son malos
  { Lat: '40.202555', Lon: '-122.632742' },
]
sonPruebas = false;

  constructor(
    public navCtrl: NavController,
    public toast: ToastController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public network: Network,
    public locac: LocationAccuracy,
    public geolocation: Geolocation,
    public device: Device,
    public utiles: ServicioUtiles,
    public appVersion: AppVersion,
    public loading: LoadingController,
    public servicioGeo: ServicioGeo,
    public http: HTTP,

  ) {
    platform.ready().then(() => {

      this.geolocation.getCurrentPosition().then((resp) => {
        if (this.sonPruebas){
          sessionStorage.setItem("latitud", this.arrPruebasLatLon[2].Lat);
          sessionStorage.setItem("longitud", this.arrPruebasLatLon[2].Lon);
        }
        else{
          sessionStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
          sessionStorage.setItem("longitud", JSON.stringify(resp.coords.longitude));
        }
/*         sessionStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
        sessionStorage.setItem("longitud", JSON.stringify(resp.coords.longitude)); */
        var lat = sessionStorage.getItem('latitud');
        var lon = sessionStorage.getItem('longitud');
        if (!this.utiles.isAppOnDevice()) {
          this.doGeocode(lat, lon);
        }
        else{
          this.doGeocodeNative(lat, lon);
        }
        
      }).catch((error) => {
        console.log('Error getting location', error);
      });

      if (!this.utiles.isAppOnDevice()) {
        //web
        //guardar local storage
        if (!localStorage.getItem('token_dispositivo')) {
          //crear token para web
          this.tokenDispositivo = (Math.random() * (1000000 - 1) + 1).toString() + ' web';
          localStorage.setItem('token_dispositivo', this.tokenDispositivo);
        }
        else {
          this.tokenDispositivo = localStorage.getItem('token_dispositivo');
        }
      }
      else {
        //crear token para web
        this.tokenDispositivo = this.device.uuid;
        localStorage.setItem('token_dispositivo', this.tokenDispositivo);
      }



    });
  }

  doGeocodeNative(lat, lon){
    this.servicioGeo.getMapaNative(lat, lon).then(response=>{
      //console.log(data);
      this.utiles.procesarRespuestaMapa(JSON.parse(response.data));

    });
  }
  doGeocode(lat, lon){
    this.servicioGeo.getMapaWeb(lat, lon).subscribe(data=>{
      //console.log(data);
      this.utiles.procesarRespuestaMapa(data);

    });
  }

  ionViewWillEnter() {
    //las variables de lat y lon deben setearse cada vez que se ingresa
    //a la pagina de home, init y ready no aplican en esa condición
    //console.log('willenter');
    //si las variables existen y son distintas se sobrescriben
    //this.obtieneCoordenadas();

  }
  setEntrada(){
    //si no tiene token_id hacemos el ingreso
    if (!sessionStorage.getItem('TOKEN_ID')){
      //siempre guardamos este valor
      this.objetoEntrada.VersionAppName = localStorage.getItem('version_app_name');
      this.objetoEntrada.Plataforma = localStorage.getItem('plataforma');
      this.objetoEntrada.VersionAppNumber = localStorage.getItem('version_number');
      this.objetoEntrada.Token = localStorage.getItem('token_dispositivo');
      this.objetoEntrada.Fecha = new Date();
      sessionStorage.setItem('ENTRADA', JSON.stringify(this.objetoEntrada));
      if (!this.utiles.isAppOnDevice()) {
        //web
        this.servicioGeo.postIngreso(this.objetoEntrada).subscribe((data: any) => {
          if (data){
            if (data.Id > 0){
              //guardamos el identificador del registro para procesarlo despues
              sessionStorage.setItem("TOKEN_ID", data.Id);

            }
          }
        });
      }
      else {
        //dispositivo
        this.servicioGeo.postIngresoNative(this.objetoEntrada).then(response => {
          let respuesta = JSON.parse(response.data);
          sessionStorage.setItem("TOKEN_ID", respuesta.Id);
        });
      }
    }

      
  }

  ngOnInit() {
    this.esIOS = this.utiles.isIOS();
    this.getVersionNumber();
    //Verifica conectividad
    this.network.onConnect().subscribe(data => {
      console.log(data.type);
      localStorage.setItem("conexion", data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      console.log(data);
      localStorage.setItem("conexion", data.type);
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
    this.setEntrada();

  }

  async displayNetworkUpdate(connectionState: string) {
    localStorage.setItem("conexion", connectionState);
    let toast = await this.toast.create({
      message: `Estas ${connectionState}, por favor conéctate a internet`,
      duration: 3000
    });
    return await toast.present();
  }

  async abrirModal() {
    const modal = await this.modalCtrl.create(
      {
        component: ModalVistaPage
      }
    );
    return await modal.present();
  }

  abrirPreguntasNinos(categoria) {
    /* localStorage.setItem("categoria", categoria); */
    sessionStorage.setItem("categoria", categoria);
    //lo cambiamos por nueva implementacion
    //this.navCtrl.navigateForward('gravedad-ninos');
    this.navCtrl.navigateForward('gravedad');
  }
  abrirCategoria(categoria){
    /* localStorage.setItem("categoria", categoria); */
    sessionStorage.setItem("categoria", categoria);
    this.navCtrl.navigateForward('gravedad');
  }
  salir() {
/*     if (!this.esIOS) {
      navigator['app'].exitApp();
    } */
  }

  async getVersionNumber() {
    var versionAppName;
    var versionNumber;
    var plataforma;
    //antes vamos a comprobar si es necesario volver a setear estas variables o no
    if (localStorage.getItem('version_number') && localStorage.getItem('varsion_app_name') && localStorage.getItem('plataforma')){
      //si ya existen entonces no hay por que volverlas a crear
      console.log('variables local storage correctas');
    }
    else{
      if (this.utiles.isAppOnDevice()){
        if (this.platform.is('ios')){
          versionAppName = await this.appVersion.getAppName();
          versionNumber = await this.appVersion.getVersionNumber();
          plataforma = "iOS";
        } 
        else if (this.platform.is('android')){
          versionAppName = await this.appVersion.getAppName();
          versionNumber = await this.appVersion.getVersionNumber();
          plataforma = "Android";
        }
        else if (this.platform.is('mobileweb')){
          versionAppName = "Urgencia Más Cercana"
          versionNumber = "0.0";
          plataforma = "Web";
        }
        else {
          versionAppName = "Urgencia Más Cercana"
          versionNumber = "0.0";
          plataforma = "No informado";
        }
      }
      else{
        versionAppName = "Urgencia Más Cercana"
        versionNumber = "0.0";
        plataforma = "Web";
      }
  
      //sobrescribimos siempre estas variables
      localStorage.setItem('version_app_name', versionAppName);
      localStorage.setItem('version_number', versionNumber);
      localStorage.setItem('plataforma', plataforma);
    }

  }

  async presentToast(mensaje, posicion){
    const toas = await this.toast.create(
      {
        message: mensaje,
        position: posicion,
        duration: 14000
      }
    );
    toas.present();
   } 

}
