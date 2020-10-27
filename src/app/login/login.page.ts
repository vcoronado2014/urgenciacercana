import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController, ModalController, Platform, ToastController, PopoverController, AlertController, IonInput } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ServicioGeo } from '../services/ServicioGeo';
import { ServicioUtiles } from '../services/ServicioUtiles';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
//router
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('inputRun', {  static: false }) inputRun: IonInput

  options: InAppBrowserOptions = {
    location: 'yes',
  };
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
  //nuevo agregado 03-06-2020
  runSeleccionado;
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
    public inap: InAppBrowser,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.platform.ready().then(async () => {
      this.procesarInfoInicio();

    });
  }
  async procesarInfoInicio(){
    this.rutaAceptoCondiciones = this.utiles.rutaAceptoCondiciones();
    this.cargando = true;
    let loader = await this.loading.create({
      message: 'Obteniendo...<br>Geoposicionamiento inicial',
      duration: 10000
    });

    await loader.present().then(async () => {
      //this.promesaGEO().then((resp)=>{
       this.geolocation.getCurrentPosition({maximumAge: 0, enableHighAccuracy: true}).then((resp) => {
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
        //aca aparece un error de google api maps (TIMEOUT)
        //CREAMOS EL TOKEN IGUAL E INFORMAMOS DEL ERROR code 1 = dijo que no a los permisos de acceso a la ubicación
        //code 2 = no tiene encendido gps
       // revisar aca
        this.cargando = false;
        loader.dismiss();
        console.log(error);
        var pagina = {
          nombre: 'login'
        }
        this.navCtrl.navigateForward('error', { queryParams: pagina }  );
      })
    })
  }
  ionViewWillEnter() {
    console.log('validar nuevamente conexion');
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params && params.valor == true){
        //volver a revisar y ejecutar el proceso
        this.procesarInfoInicio();
      }
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
      let target = "_system";
      this.inap.create(encodeURI(this.rutaAceptoCondiciones), target, this.options);
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
  async presentAlert(mensaje, subheader, header) {
    const alert = await this.alert.create({
      header: header,
      subHeader: subheader,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentAlertConfirm(mensaje, subheader, header) {
    const alert = await this.alert.create({
      header: header,
      message: mensaje,
      subHeader: subheader,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
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
    //nueva validacion run
    if (entidadRegistro.Run == null || entidadRegistro.Run == undefined || entidadRegistro.Run == ''){
      errores.push('Run requerido');
    }
    else {
      if (this.utiles.Rut(entidadRegistro.Run) == false) {
        errores.push('Run inválido');
      }
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
  validaRut(event){
    if (event.target.value){
      if (!this.utiles.Rut(event.target.value)) {
        console.log('run incorrecto');
        //si no es correcto dejarlo en blanco
        this.runSeleccionado = '';
        this.inputRun.setFocus();
      }
    }
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
        //nuevo 03-06-2020
        Run: this.runSeleccionado
  
      }
      //pasar a la pagina siguiente despues de guardar
      //console.log(entidadRegistro);
      var obj = this.validaRegistro(entidadRegistro);
      if (obj.Errores.length > 0){
        //mostrar alerta
        this.presentAlert(obj.ErrorStr, "Existen errores en el Formulario...", "Errores");
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
        this.presentAlert("Para continuar debe aceptar las condiciones del servicio, puede revisar las condiciones haciendo click en el ícono al costado derecho del check.", "Debe aceptar los términos y Condiciones", "Advertencia")
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
          //console.log(data);
          this.procesarRegistroL(data, loader);
          
        },
        (error) => {
          this.utiles.presentToast('No hay comunicación con el servidor', 'bottom', 5000);
          console.log(error);
          this.procesarRegistroL(null, loader);
        }
        );
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

        },
        (error)=>{
          this.utiles.presentToast('No hay comunicación con el servidor', 'bottom', 5000);
          console.log(error);
          this.procesarRegistroL(null, loader);
        }
        );
      }

    })
  }

   promesaGEO = () => {
    return this.geolocation.getCurrentPosition();
   }

}
