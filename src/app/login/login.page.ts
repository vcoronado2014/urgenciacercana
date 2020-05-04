import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ModalController, Platform, ToastController, PopoverController, AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ServicioGeo } from '../services/ServicioGeo';
import { ServicioUtiles } from '../services/ServicioUtiles';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  tokenDispositivo: any;
  arrDias = [];
  arrMeses = [];
  arrAnios = [];
  nombreSeleccionado;
  apellidoSeleccionado;
  correoSeleccionado;
  sexoSeleccionado;
  diaSeleccionado;
  mesSeleccionado;
  anioSeleccionado;
  telefonoSeleccionado = '+569';
  cargando = false;

  arrPruebasLatLon =[
    //pasaje las estacas temuco
    { Lat: '-38.7665599', Lon: '-72.7686996' },
    //osorno -40.590819, -73.100826
    { Lat: '-40.590819', Lon: '-73.100826' },
  ]
  sonPruebas = false;
  rutaAceptoCondiciones;
  aceptaCondiciones = true;

  constructor(
    public navCtrl: NavController,
    public geolocation: Geolocation,
    public loading: LoadingController,
    public platform: Platform,
    public modalCtrl: ModalController,
    public toast: ToastController,
    public popover: PopoverController,
    public geo: ServicioGeo,
    public utiles: ServicioUtiles,
    public device: Device,
    public appVersion: AppVersion,
    public alert: AlertController,
  ) {
    this.platform.ready().then(async () => {
      //setTimeout(async () => {
        //console.log('ready');
      //LENAMOS DATOS INICIALES
      this.rutaAceptoCondiciones = this.utiles.rutaAceptoCondiciones();
      this.cargando = true;
      let loader = await this.loading.create({
        message: 'Obteniendo...<br>Geoposicionamiento inicial',
        duration: 10000
      });
  
      await loader.present().then(async () => {
        //this.promesaGEO().then((resp)=>{
         this.geolocation.getCurrentPosition().then((resp) => {
          //console.log(resp);
          if (this.sonPruebas){
            sessionStorage.setItem("latitud", this.arrPruebasLatLon[0].Lat);
            sessionStorage.setItem("longitud", this.arrPruebasLatLon[0].Lon);
          }
          else{
            sessionStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
            sessionStorage.setItem("longitud", JSON.stringify(resp.coords.longitude));
          }
          /* sessionStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
          sessionStorage.setItem("longitud", JSON.stringify(resp.coords.longitude)); */
          var lat = sessionStorage.getItem('latitud');
          var lon = sessionStorage.getItem('longitud');
          let dataReverse = null;
          if (!this.utiles.isAppOnDevice()){
            this.geo.getMapaWeb(lat, lon).subscribe(data=>{
              //console.log(data);
              //this.utiles.procesarRespuestaMapa(data);
              dataReverse = data;
              //console.log(dataReverse);
              this.utiles.procesarRespuestaMapa(dataReverse);
              //crear token
              loader.dismiss();
              this.crearToken();
              
            });
          }
          else{
            this.geo.getMapaNative(lat, lon).then(response=>{
              dataReverse = JSON.parse(response.data);
              //console.log(dataReverse);
              this.utiles.procesarRespuestaMapa(dataReverse);
              loader.dismiss();
              this.crearToken();
              //loader.dismiss();
            });
          }

        }).catch(error => {
          //loader.dismiss();
          console.log(error);
          this.cargando = false;
        })

      //}, 10000);
      })
    });
  }
  doGeocode(lat, lon){
    this.geo.getMapaWeb(lat, lon).subscribe(data=>{
      //console.log(data);
      this.utiles.procesarRespuestaMapa(data);

    });
  }
  abrirPDF(){
    if (this.utiles.isAppOnDevice()){
      //dispositivo movil
      window.open(encodeURI(this.rutaAceptoCondiciones), "_system", "location=yes");
    }
    else {
      //web
      window.open(encodeURI(this.rutaAceptoCondiciones), "_system", "location=yes");
    }
    
  }

  doGeocodeNative(lat, lon){
    this.geo.getMapaNative(lat, lon).then(response=>{
      //console.log(data);
      this.utiles.procesarRespuestaMapa(JSON.parse(response.data));

    });
  }
  async presentAlert(mensaje) {
    const alert = await this.alert.create({
      header: 'Errores',
      subHeader: 'Existen errores en el Formulario...',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
  validaRegistro(entidadRegistro){
    var objetoError = {
      Errores: [],
      ErrorStr: ''
    };
    var errores = [];
    var erroresStr = '';
    if (entidadRegistro.Nombres == null || entidadRegistro.Nombres == undefined || entidadRegistro.Nombres == ''){
      errores.push('Nombre requerido');
    }
    if (entidadRegistro.Apellidos == null || entidadRegistro.Apellidos == undefined || entidadRegistro.Apellidos == ''){
      errores.push('Apellido requerido');
    }
    if (entidadRegistro.CorreoElectronico == null || entidadRegistro.CorreoElectronico == undefined || entidadRegistro.CorreoElectronico == ''){
      errores.push('Correo requerido');
    }
    else {
      if (!this.utiles.emailIsValid(entidadRegistro.CorreoElectronico)){
        errores.push('Formato de correo inválido');
      }
    }
    if (entidadRegistro.TelefonoContacto == null || entidadRegistro.TelefonoContacto == undefined || entidadRegistro.TelefonoContacto == ''){
      errores.push('Teléfono requerido');
    }
    else {
      if (!this.utiles.phoneIsValid(entidadRegistro.TelefonoContacto)){
        errores.push('Formato de teléfono inválido');
      }
    }
    if (entidadRegistro.Sexo == null || entidadRegistro.Sexo == undefined || entidadRegistro.Sexo == ''){
      errores.push('Sexo requerido');
    }
    if (entidadRegistro.DiaNacimiento == null || entidadRegistro.DiaNacimiento == undefined || entidadRegistro.DiaNacimiento == ''){
      errores.push('Día nacimiento requerido');
    }
    if (entidadRegistro.MesNacimiento == null || entidadRegistro.MesNacimiento == undefined || entidadRegistro.MesNacimiento == ''){
      errores.push('Mes nacimiento requerido');
    }
    if (entidadRegistro.AnioNacimiento == null || entidadRegistro.AnioNacimiento == undefined || entidadRegistro.AnioNacimiento == ''){
      errores.push('Año nacimiento requerido');
    }
    
    //procesar los errores
    if (errores && errores.length > 0){
      errores.forEach(error => {
        erroresStr += error + ', ';
      });
      objetoError.Errores = errores;
      objetoError.ErrorStr = erroresStr;
    }

    return objetoError;
  }
  async registrarse(){
    if (this.aceptaCondiciones){
      var entidadRegistro = {
        Nombres: this.nombreSeleccionado,
        Apellidos: this.apellidoSeleccionado,
        CorreoElectronico: this.correoSeleccionado,
        NombreUsuario: this.correoSeleccionado,
        Sexo: this.sexoSeleccionado,
        DiaNacimiento: this.diaSeleccionado,
        MesNacimiento: this.mesSeleccionado,
        AnioNacimiento: this.anioSeleccionado,
        Pais: sessionStorage.getItem('pais'),
        Provincia: sessionStorage.getItem('provincia'),
        Region: sessionStorage.getItem('region'),
        Comuna: sessionStorage.getItem('comuna'),
        Password: '',
        ModoRegistro: 0,
        Apodo: '',
        Avatar: '',
        VersionAppName: localStorage.getItem('version_app_name'),
        IdDispositivo: localStorage.getItem('token_dispositivo'),
        Plataforma: localStorage.getItem('plataforma'),
        VersionAppNumber: localStorage.getItem('version_number'),
        TelefonoContacto: this.telefonoSeleccionado,
        Latitud: sessionStorage.getItem('latitud'),
        Longitud: sessionStorage.getItem('longitud'),
        Eliminado: '0',
        Activo: '1',
  
      }
      //pasar a la pagina siguiente despues de guardar
      //console.log(entidadRegistro);
      var obj = this.validaRegistro(entidadRegistro);
      if (obj.Errores.length > 0){
        //mostrar alerta
        this.presentAlert(obj.ErrorStr);
      }
      else {
        //continuar y guardar
        let loader = await this.loading.create({
          message: 'Espere...<br><br>Realizando tu registro',
          duration: 20000
        });
    
        await loader.present().then(async () => {
          if (!this.utiles.isAppOnDevice()) {
            //llamada web
            this.geo.postRegistro(entidadRegistro).subscribe((data: any) => {
              localStorage.setItem('REGISTRO', JSON.stringify(data));
              localStorage.setItem('TIENE_REGISTRO', 'true');
              loader.dismiss();
              this.navCtrl.navigateRoot('home');
            });
          }
          else {
            //llamada nativa
            this.geo.postRegistroNative(entidadRegistro).then((response: any)=>{
              var data = JSON.parse(response.data);
              localStorage.setItem('REGISTRO', JSON.stringify(data));
              localStorage.setItem('TIENE_REGISTRO', 'true');
              loader.dismiss();
              this.navCtrl.navigateRoot('home');
            });
  
          }
        });
      }
    }
  }
  onChangeAcepta(event){
    
    if (event.detail){
      if (event.detail.checked == false){
        this.presentAlert("Para continuar debe aceptar las condiciones del servicio, puede revisar las condiciones haciendo click en el ícono al costado derecho del check.")
      }
    }
  }
  ingresar(proveedor: string){
    //console.log(proveedor);
    if (proveedor == 'google'){
      
    } 
  }
  procesarRegistroL(data, loading: any){
    if (data && data.Id > 0){
      if (data.Activo == 1 && data.Eliminado == 0) {
        //tiene registro
        var registro = JSON.stringify(data);
        localStorage.setItem('REGISTRO', registro);
        localStorage.setItem('TIENE_REGISTRO', 'true');
        loading.dismiss();
        this.cargando = false;
        this.irAHome();
      }
      else{
        localStorage.setItem('TIENE_REGISTRO', 'false');
        loading.dismiss();
        this.cargando = false;
        this.utiles.presentToast('Su registro se encuentra inactivo, vuelva a registrarse', 'middle', 10000);

      }
    }
    else {
      //no tiene registro
      localStorage.setItem('TIENE_REGISTRO', 'false');
      loading.dismiss();
      this.cargando = false;
    }
  }
  procesarRegistro(data){
    if (data && data.Id > 0){
      if (data.Activo == 1 && data.Eliminado == 0) {
        //tiene registro
        var registro = JSON.stringify(data);
        localStorage.setItem('REGISTRO', registro);
        localStorage.setItem('TIENE_REGISTRO', 'true');
        this.irAHome();
      }
      else{
        localStorage.setItem('TIENE_REGISTRO', 'false');
        this.utiles.presentToast('Su registro se encuentra inactivo, vuelva a registrarse', 'middle', 10000);

      }
    }
    else {
      //no tiene registro
      localStorage.setItem('TIENE_REGISTRO', 'false');
    }
  }
  ngOnInit() {
    var mesActual = new Date().getMonth();
    //cargamos las listas
    this.arrDias = this.utiles.retornaDiasDelMesInt(parseInt(mesActual.toString()));
    this.arrMeses = this.utiles.retornaMeses();
    this.arrAnios = this.utiles.retornaAnios();
  }
  irAHome(){
    this.navCtrl.navigateRoot('home');
  }
  async getVersionNumber() {
    var versionAppName;
    var versionNumber;
    var plataforma;
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
  onChangeDia(event){
    //console.log(event);
  }
  onChangeMes(event){
    //console.log(event);
    if (event.detail.value){
      this.arrDias = this.utiles.retornaDiasDelMesStr(event.detail.value);
      //verificamos si ya tenía un dia seleccionado
      var estaEnLista = false;
      this.arrDias.forEach(element => {
        if (element.Dia == this.diaSeleccionado){
          estaEnLista = true;
        }
      });
      if (!estaEnLista){
        this.diaSeleccionado = undefined;
      }
    }
    
  }

  async crearToken(){
    var versionAppName;
    var versionNumber;
    var plataforma;
    let loader = await this.loading.create({
      message: 'Creando...<br>Token inicial',
      duration: 20000
    });

    await loader.present().then(async () => {
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
        versionAppName = "Urgencia Más Cercana"
        versionNumber = "0.0";
        plataforma = "Web";
        //loader.dismiss();
        //otras variables
        localStorage.setItem('version_app_name', versionAppName);
        localStorage.setItem('version_number', versionNumber);
        localStorage.setItem('plataforma', plataforma);
        this.geo.getRegistroApp(this.tokenDispositivo).subscribe(async (data: any) => {
          //this.procesarRegistro(data);
          //console.log(data);
          this.procesarRegistroL(data, loader);
          //loader.dismiss();
          
        });
      }
      else {
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
        //crear token para web
        this.tokenDispositivo = this.device.uuid;
        localStorage.setItem('token_dispositivo', this.tokenDispositivo);
        //otras variables
        localStorage.setItem('version_app_name', versionAppName);
        localStorage.setItem('version_number', versionNumber);
        localStorage.setItem('plataforma', plataforma);
        this.geo.getRegistroAppNative(this.tokenDispositivo).then(async (response: any) => {
          this.procesarRegistroL(JSON.parse(response.data), loader);
          //this.procesarRegistro(JSON.parse(data));
          //loader.dismiss();

        });
        //loader.dismiss();
      }

    })
  }

   promesaGEO = () => {
    return this.geolocation.getCurrentPosition();
   }

}
