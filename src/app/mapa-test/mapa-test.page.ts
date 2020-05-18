import { Component, OnInit, ViewChild, ElementRef,ChangeDetectorRef, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, ModalController, Platform, ToastController, PopoverController } from '@ionic/angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { ServicioGeo } from '../../app/services/ServicioGeo';
import { ServicioUtiles } from '../../app/services/ServicioUtiles';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
//component
import { PopoverComponent } from '../components/popover/popover.component';
import { Environment } from '@ionic-native/google-maps';
import { promise } from 'protractor';
//moment
import * as moment from 'moment';
//pagina busqueda
import { BusquedaPage } from '../busqueda/busqueda.page';

declare var google;

@Component({
  selector: 'app-mapa-test',
  templateUrl: './mapa-test.page.html',
  styleUrls: ['./mapa-test.page.scss'],
})
export class MapaTestPage implements OnInit {
  options: InAppBrowserOptions = {
    location: 'no',
  };
  
  @ViewChild('map', { static: true }) mapElement: ElementRef;

  map: any;
 
  /* transporte: any = localStorage.getItem("transporte"); */
  transporte: any = sessionStorage.getItem("transporte");
  iconTransporte: any;
  direccion: any = "direccion1";
  /* categoria:any = localStorage.getItem("categoria"); */
  categoria:any = sessionStorage.getItem("categoria");

  start = {
/*     lat: JSON.parse(localStorage.getItem("latitud")),
    lng: JSON.parse(localStorage.getItem("longitud")) */
    lat: JSON.parse(sessionStorage.getItem("latitud")),
    lng: JSON.parse(sessionStorage.getItem("longitud"))
  };
 
  directionsService = new google.maps.DirectionsService;
  
  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true
  });
  infoWindow = new google.maps.InfoWindow();
  //infoWindow = this.map.;
  
  markers = [];
  esRayen:boolean;
  icono;

  //Variables de tiempo de desplazamiento segun modo barra superior, modos diferentes mismo destino
  tiempoWalking:any;
  tiempoDriving:any;
  tiempoTransit:any;

  //Variables de tiempo de desplazamiento, barra inferior, destinos diferentes mismo modo
  tiempoCentro1:any;
  tiempoCentro2:any;
  tiempoCentro3:any;
  //Variables de nombres de los 3 centros mas cercanos
  nombreCentro1:any;
  nombreCentro2:any;
  nombreCentro3:any;

  largoNombreCentro1:any;
  largoNombreCentro2:any;
  largoNombreCentro3:any;
  //Variables de direcciones de los 3 centros mas cercanos
  direccionCentro1:any;
  direccionCentro2:any;
  direccionCentro3:any;

  //variables boolean de esRayen
  esRayen1:boolean;
  esRayen2:boolean;
  esRayen3:boolean;

  //variables de tiempo de espera por categoria seleccionada
  tiempoEspera1:any;
  tiempoEspera2:any;
  tiempoEspera3:any;

  //varible de distancia de infowindow
  distancia:any;

  //Variables de lat y long para cada uno de los 3 centros
  destino1 = { lat: null, lng: null,  ProcesarDirection: false };
  destino2 = {lat: null, lng: null,  ProcesarDirection: false };
  destino3 = {lat: null, lng: null,  ProcesarDirection: false };

  //Lat y Long de la posicion del usuario
  /* lati = localStorage.getItem("latitud"); */
  lati = sessionStorage.getItem("latitud");
  latConComa = this.lati.replace(/\./gi, ",");

  /* longi = localStorage.getItem("longitud"); */
  longi = sessionStorage.getItem("longitud");
  longiConComa = this.longi.replace(/\./gi, ",");

  //variable de gravedad escogida por usuario
  /* gravedadUsuario:any = localStorage.getItem("gravedad"); */
  gravedadUsuario:any = sessionStorage.getItem("gravedad");

  //variables creadas por coro
  //formato string con coma, de ser necesario hay que convertirlo
  latitudEnviar:any;
  longitudEnviar:any;
  //gravedad en formato string del 0 al 4
  gravedadEnviar:any;
  //en string y el valor por defecto sería 10000
  distanciaEnviar:any;
  //arreglo de los resultados de la consulta
  centros:any;
  centrosMasCercanos:any;

  infoApp: any;

  srcPropaganda = '';
  tituloPropaganda = '';
  subTituloPropaganda = '';
  //variable para el objeto de movimiento
  objetoMovimiento = {
    VersionAppName: '',
    Plataforma: '',
    Token: '',
    VersionAppNumber: '',
    Fecha: new Date(),
    ObjetoSerializado: null,
    TokenId: '0'
  }
  //agregado para diferenciar public o privada
  esPublico = false;

  propaganda = {
    Nombre: '',
    Titulo: '',
    Subtitulo: '',
    RutaImagen: '',
    Telefonos:'',
    CorreoElectronico: '',
    PaginaWeb: '',

  }
  largoTitulo: any;

  constructor(
    public navCtrl: NavController,
    public loading: LoadingController,
    public geo: ServicioGeo,
    private ref: ChangeDetectorRef,
    public platform: Platform,
    private launchNavigator: LaunchNavigator,
    public modalCtrl: ModalController,
    public toast: ToastController,
    public http: HTTP,
    public utiles: ServicioUtiles,
    public popover: PopoverController,
    private route: ActivatedRoute,
    private router: Router,
    public inap: InAppBrowser,
  ) {
     // moment.locale('es');
      //console.log(moment().fromNow());

   }
   abrirEmail(){
    let uri = 'mailto:' + this.propaganda.CorreoElectronico;
    let target = "_system";
    if (this.utiles.isAppOnDevice()){
      //dispositivo movil
      //window.open(encodeURI(this.rutaAceptoCondiciones), "_system", "location=yes");
      this.inap.create(uri, target, {});
    }
    else {
      //web
      window.open(uri, target);
    }
    
  }
   //implementación para mostrar un modal en vez de la pagina completa
   async presentModalBusqueda(){
     const modalBuscar =  await this.modalCtrl.create({
      component: BusquedaPage,
      componentProps:{

      }
     })
     return await modalBuscar.present();
   }
  async presentPopover(ev: any) {
    const popover = await this.popover.create({
      component: PopoverComponent,
      event: ev,
      translucent: true,
      mode: 'ios',
      componentProps: {
        "icon": this.iconTransporte,
        "categoria": this.categoria
      },
    });
    return await popover.present();
  }

   promesaHTTP = (latitud, longitud, distancia, gravedad, esPublico, categoria) => {
    const headers = new Headers;
    const body =
    {
      Latitud: latitud, Longitud: longitud, Distancia: distancia, Gravedad: gravedad, EsPublico: esPublico, Categoria: categoria
    };

    let url = environment.API_ENDPOINT + 'Geolocalizacion';
    this.http.setDataSerializer('json');


    return this.http.post(url, body, {});
    //return JSON.parse(response.data);
   }

   async presentLoadingNativePromesa(){
    //seteo de las variables
    this.latitudEnviar = this.latConComa;
    this.longitudEnviar = this.longiConComa;
    this.distanciaEnviar = '10000';
    this.centros = [];
    this.centrosMasCercanos = [];

    //iconos dinámicos
    if (this.transporte == "WALKING") {
      this.iconTransporte = "walk";
    } else if (this.transporte == "DRIVING") {
      this.iconTransporte = "car";
    } else if (this.transporte == "TRANSIT") {
      this.iconTransporte = "bus";
    }

    //Gravedad modificada para la tabla. El usuario escoge del 1 al 5
    //pero la tabla recibe del 0 al 4
    switch (this.gravedadUsuario) {
      case "5":
        this.gravedadEnviar = "0";
      case "4":
        this.gravedadEnviar = "1";
      case "3":
        this.gravedadEnviar = "2";
      case "2":
        this.gravedadEnviar = "3";
      case "1":
        this.gravedadEnviar = "4";
      default:
        break;
    }
         //iniciamos loading
    let loader = await this.loading.create({
      message: 'Calculando...<br><br>Los tiempos son aproximados<br><br>Asegúrate de tener conexión de internet y compartir tu ubicación',
      duration: 20000
    });

    await loader.present().then(async () => {

      try {
        var publico = 0;
        //VAMOS A TENER QUE REALIZAR UN ORDENAMIENTO MANUAL ACA, YA QUE DESDE LA API EN WEB
        //LO DEVUELVE ORDENADO Y EN LA API NATIVA LO DEVUELVE DESORDENADO, HAY QUE CAPTURAR
        //EL ELEMTNO DISTANCIA Y ORDENARLO
        
        if (sessionStorage.getItem('ES_PUBLICO')){
          if (JSON.parse(sessionStorage.getItem('ES_PUBLICO'))){
            publico = 1
          }
        }
        this.promesaHTTP(this.latitudEnviar, this.longitudEnviar, this.distanciaEnviar, this.gravedadEnviar, publico, this.categoria).then((response : any) => {
          if (environment.ProcesaHorario){
            this.centros = this.utiles.procesaFechaHoraTermino(JSON.parse(response.data));
          }
          else{
            this.centros = JSON.parse(response.data);
          }
          //ordenamos para nativo
          this.centros.sort(this.sortLista);
          //antes de asociar los centros cercanos debemos ver cuantos vienen, por que si hay menos de 3 hay que reprocesar
          //los elementos en el dom y mostrar solo alguna información no toda, así evitamos llamadas a la api
          //directions
          //lo reemplazamos por el metodo setearEStablecimientos
          this.setearEstablecimientos();
 
          //Llamadas para la creacion del mapa y las rutas
          this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 14,
            center: this.start,
            zIndex: -1,
            mapTypeControl: environment.viewMapTypeControl,
            fullscreenControl: environment.viewfullscreenControl,
            ZoomControl: environment.viewZoomControl,
            streetViewControl: environment.viewstreetViewControl,
          });
          this.directionsDisplay.setMap(this.map);
  
          if (this.destino1 || this.destino2 || this.destino3){
            return this.promesaDirection(this.start, this.destino1, this.transporte);
          }
        })
        .then((data : any) => {
          //llamada a route
          this.directionsDisplay.setDirections(data);
          //Obtener tiempos de desplazamiento
          //console.log(data);
  
          //calculo de distancia
          this.distancia = data.routes[0].legs[0].distance.text;
          //para ver cual queda guardado en la consulta BD
          var seleccionado = this.transporte;
          var guardaW = false;
          var guardaD = false;
          var guardaT = false;
          if (seleccionado == 'WALKING'){
            guardaW = true;
          }
          if (seleccionado == 'DRIVING'){
            guardaD = true;
          }
          if (seleccionado == 'TRANSIT'){
            guardaT = true;
          }

          this.calculaTiempoTransporteSinLoader('WALKING', guardaW);
          this.calculaTiempoTransporteSinLoader('DRIVING', guardaD);
          this.calculaTiempoTransporteSinLoader('TRANSIT', guardaT);
  
          if (this.destino1.ProcesarDirection){
            this.calcularTiempoDestinoF(this.destino1);
          }
          if (this.destino2.ProcesarDirection){
            this.calcularTiempoDestinoF(this.destino2);
          }
          if (this.destino3.ProcesarDirection){
            this.calcularTiempoDestinoF(this.destino3);
          }
          
          if (this.destino1.ProcesarDirection){
            this.crearMarkerB(this.destino1, this.nombreCentro1, this.centrosMasCercanos[0], this.esRayen1);
          }
          
          this.crearMarkerA(this.start, "Estas cerca de aquí", "./assets/imgs/pin_verde.png");
  
          //console.log(this.transporte + ' ' + data.routes[0].legs[0].duration.text);
          
          loader.dismiss();
        })

      }
      catch (error) {
        //en ios no viene el objeto error, se debe identificar para mostrar un toast correctamente
        if (this.platform.is('ios')) {
          //mensaje de error personalizado para ios
          this.utiles.presentToast('No hay resultados para su ubicación geográfica', 'middle', 10000);
        }
        else {
          this.utiles.presentToast('No hay resultados para su ubicación geográfica', 'middle', 10000);
        }
        this.setArregloVacio();
        loader.dismiss();
      }
    });
   }
   sortLista(a, b){
    let distancea = a.Distance;
    let distanceb = b.Distance;
    if (distancea > distanceb) return 1;
    if (distanceb > distancea) return -1;
    return 0;
  }
   promesaDirection = (start, destino, transporte) => {
    let promise = new Promise((resolve, reject)=>{
      this.directionsService.route({
        origin: start,
        destination: destino,
        travelMode: transporte
      }, (response, status) => {
        if (status === 'OK') {
          resolve(response)
          reject('Error al consultar directions service')
        } else {
          // window.alert('Directions request failed due to ' + status);
          //aca el status puede ser ZERO_RESULTS, hay que controlarlo

        }
      });
    });
    return promise;

   }
   promesaDirectionNative = (start, destino, transporte) => {
    let promise = new Promise((resolve, reject)=>{
      this.directionsService.route({
        origin: start,
        destination: destino,
        travelMode: transporte
      }, (response, status) => {
        if (status === 'OK') {
          resolve(response)
          reject('Error al consultar directions service')
        } else {
          // window.alert('Directions request failed due to ' + status);
          //aca el status puede ser ZERO_RESULTS, hay que controlarlo

        }
      });
    });
    return promise;

   }

   async presentLoading(){
    //seteo de las variables
    //verificar esto, ya que deberia ser sin coma

     this.latitudEnviar = this.latConComa;
    this.longitudEnviar = this.longiConComa; 


    //this.gravedadEnviar= localStorage.getItem("gravedad");
    this.distanciaEnviar = '10000';
    this.centros = [];
    this.centrosMasCercanos = [];

    //iconos dinámicos
    if (this.transporte == "WALKING") {
      this.iconTransporte = "walk";
    } else if (this.transporte == "DRIVING") {
      this.iconTransporte = "car";
    } else if (this.transporte == "TRANSIT") {
      this.iconTransporte = "bus";
    }

    //Gravedad modificada para la tabla. El usuario escoge del 1 al 5
    //pero la tabla recibe del 0 al 4
    switch (this.gravedadUsuario) {
      case "5":
        this.gravedadEnviar = "0";
      case "4":
        this.gravedadEnviar = "1";
      case "3":
        this.gravedadEnviar = "2";
      case "2":
        this.gravedadEnviar = "3";
      case "1":
        this.gravedadEnviar = "4";
      default:
        break;
    }
         //iniciamos loading
    let loader = await this.loading.create({
      message: 'Calculando...<br><br>Los tiempos son aproximados<br><br>Asegúrate de tener conexión de internet y compartir tu ubicación',
      duration: 20000
    });

    await loader.present().then(() => {
      var publico = 0;
      if (sessionStorage.getItem('ES_PUBLICO')){
        if (JSON.parse(sessionStorage.getItem('ES_PUBLICO'))){
          publico = 1
        }
      }

      this.geo.get(this.latitudEnviar, this.longitudEnviar, this.distanciaEnviar, this.gravedadEnviar, publico, this.categoria).subscribe(
        data => {
          //aca debemos atachar la data para procesarla de acuerdo a la hora de consulta
          //this.utiles.procesaFechaHoraTermino
          if (environment.ProcesaHorario){
            this.centros = this.utiles.procesaFechaHoraTermino(data);
          }
          else{
            this.centros = data;
          }
          this.setearEstablecimientos();
          //Llamadas para la creacion del mapa y las rutas
          this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 14,
            center: this.start,
            zIndex: -1,
            mapTypeControl: environment.viewMapTypeControl,
            fullscreenControl: environment.viewfullscreenControl,
            ZoomControl: environment.viewZoomControl,
            streetViewControl: environment.viewstreetViewControl,
          });
          this.directionsDisplay.setMap(this.map);


          if (this.destino1 || this.destino2 || this.destino3) {
            this.directionsService.route({
              origin: this.start,
              destination: this.destino1,
              travelMode: this.transporte
            }, (response, status) => {
              if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
                //Obtener tiempos de desplazamiento
                //console.log(response);

                //calculo de distancia
                this.distancia = response.routes[0].legs[0].distance.text;
                //para ver cual queda guardado en la consulta BD
                var seleccionado = this.transporte;
                var guardaW = false;
                var guardaD = false;
                var guardaT = false;
                if (seleccionado == 'WALKING') {
                  guardaW = true;
                }
                if (seleccionado == 'DRIVING') {
                  guardaD = true;
                }
                if (seleccionado == 'TRANSIT') {
                  guardaT = true;
                }

  
                calcularTiempoTransporte('WALKING', guardaW);
                calcularTiempoTransporte('DRIVING', guardaD);
                calcularTiempoTransporte('TRANSIT', guardaT);

                if (this.destino1.ProcesarDirection){
                  this.calcularTiempoDestinoF(this.destino1);
                }
                if (this.destino2.ProcesarDirection){
                  this.calcularTiempoDestinoF(this.destino2);
                }
                if (this.destino3.ProcesarDirection){
                  this.calcularTiempoDestinoF(this.destino3);
                }
                
                
                
                if (this.destino1.ProcesarDirection) {
                  this.crearMarkerB(this.destino1, this.nombreCentro1, this.centrosMasCercanos[0], this.esRayen1);
                }
                this.crearMarkerA(this.start, "Estas cerca de aquí", "./assets/imgs/pin_verde.png");

                //console.log(this.transporte + ' ' + response.routes[0].legs[0].duration.text);
              } else {
                // window.alert('Directions request failed due to ' + status);
                //aca el status puede ser ZERO_RESULTS, hay que controlarlo

              }
            });
          }
          //enviamos las demas promesas
          //Segunda Promesa
          let calcularTiempoTransporte = (mode, guardaMovimiento) => {
            new Promise(async (resolve, reject) => {
              let loaderTT = await this.loading.create({
                message: 'Calculando tiempo transporte...',
                duration: 5000
              });
          
              await loaderTT.present().then(() => {
                this.directionsService.route({
                  origin: this.start,
                  destination: this.destino1,
                  travelMode: mode
                }, (response, status) => {
                  if (status === 'OK') {
  
                    if (mode == 'WALKING') {
                      this.tiempoWalking = response.routes[0].legs[0].duration.text;
                    }
                    if (mode == 'DRIVING') {
                      this.tiempoDriving = response.routes[0].legs[0].duration.text;
                    }
                    if (mode == 'TRANSIT') {
                      this.tiempoTransit = response.routes[0].legs[0].duration.text;
                    }
  
                    //console.log(mode + ' dentro de rutas' + ' ' + response.routes[0].legs[0].duration.text);
                    //console.log('capturar movimiento');
                    //serializar y guardar
                    //debemos guardar los centros
                    //debemos guardar lat y lon
                    //debemos guardar response
                    if (guardaMovimiento){
                      var ruta = {
                        distance: null,
                        duration: null,
                        end_adress: null,
                        end_location: null,
                        start_address: null,
                        start_location: null,
                        Transporte: null,
                        Gravedad: null,
                        Categoria: null,
                      };
                      if (response.routes){
                        if (response.routes[0].legs){
                          ruta.distance = response.routes[0].legs[0].distance;
                          ruta.duration = response.routes[0].legs[0].duration;
                          ruta.end_adress = response.routes[0].legs[0].end_adress;
                          ruta.end_location = response.routes[0].legs[0].end_location;
                          ruta.start_address = response.routes[0].legs[0].start_address;
                          ruta.start_location = response.routes[0].legs[0].start_location;
                        }
                      }
                      ruta.Transporte = mode;
                      ruta.Gravedad = this.gravedadEnviar;
                      ruta.Categoria = this.categoria;
                      var objSer = {
                        Centros: this.centrosMasCercanos,
                        Latitud: this.latitudEnviar,
                        Longitud: this.longitudEnviar,
                        Busqueda: ruta
                      }
                      this.setEntrada(objSer);
                    }


                  } else {
                    // window.alert('Directions request failed due to ' + status);
                    this.utiles.presentToast('status error:' + status, 'bottom', 8000);
                  }
  
                });
              })

            }).then((data) => {
              //console.log('resultado del then segunda promesa ' + data);
            });
          }
          //console.log('capturar movimiento');
        },
        err => {
          this.setArregloVacio();
          this.utiles.presentToast('No hay establecimientos cercanos en su ubicación geográfica', 'middle', 10000);
          console.log(err);
        },
        () => console.log('get centros completed')
      );






    });

    loader.dismiss();
   }

   //creamos objetos vacios
   setArregloVacio(){
    this.centros = [
      {
        Nombre: 'No hay',
        Direccion: '',
        Telefonos: '',
        Latitud: 0,
        Longitud: 0,
        TiempoEspera: 0,
        EsRayen: true,
        HorarioLunVie: '0-0',
        HorarioSabDom: '0-0',
        ProcesarDirection: false
      },
      {
        Nombre: 'No hay',
        Direccion: '',
        Telefonos: '',
        Latitud: 0,
        Longitud: 0,
        TiempoEspera: 0,
        EsRayen: true,
        HorarioLunVie: '0-0',
        HorarioSabDom: '0-0',
        ProcesarDirection: false
      },
      {
        Nombre: 'No hay',
        Direccion: '',
        Telefonos: '',
        Latitud: 0,
        Longitud: 0,
        TiempoEspera: 0,
        EsRayen: true,
        HorarioLunVie: '0-0',
        HorarioSabDom: '0-0',
        ProcesarDirection: false
      }
    ];
    this.centrosMasCercanos = this.centros.slice(0,3);
    this.nombreCentro1 = this.centrosMasCercanos[0].Nombre;
    this.nombreCentro2 = this.centrosMasCercanos[1].Nombre;
    this.nombreCentro3 = this.centrosMasCercanos[2].Nombre;

    this.largoNombreCentro1 = this.nombreCentro1.length;
    this.largoNombreCentro2 = this.nombreCentro2.length;
    this.largoNombreCentro3 = this.nombreCentro3.length;

    this.direccionCentro1 = this.centrosMasCercanos[0].Direccion;
    this.direccionCentro2 = this.centrosMasCercanos[1].Direccion;
    this.direccionCentro3 = this.centrosMasCercanos[2].Direccion;

    this.esRayen1 = this.centrosMasCercanos[0].EsRayen;
    this.esRayen2 = this.centrosMasCercanos[1].EsRayen;
    this.esRayen3 = this.centrosMasCercanos[2].EsRayen;

    this.tiempoEspera1 = this.centrosMasCercanos[0].TiempoEspera;
    this.tiempoEspera2 = this.centrosMasCercanos[1].TiempoEspera;
    this.tiempoEspera3 = this.centrosMasCercanos[2].TiempoEspera;

    this.destino1 = {
      lat: this.centrosMasCercanos[0].Latitud,
      lng: this.centrosMasCercanos[0].Longitud,
      ProcesarDirection: this.centrosMasCercanos[0].ProcesarDirection
    };
    this.destino2 = {
      lat: this.centrosMasCercanos[1].Latitud,
      lng: this.centrosMasCercanos[1].Longitud,
      ProcesarDirection: this.centrosMasCercanos[1].ProcesarDirection
    };
    this.destino3 = {
      lat: this.centrosMasCercanos[2].Latitud,
      lng: this.centrosMasCercanos[2].Longitud,
      ProcesarDirection: this.centrosMasCercanos[2].ProcesarDirection
    };
    //mostramos igual el mapa
     //Llamadas para la creacion del mapa y las rutas
     this.map = new google.maps.Map(this.mapElement.nativeElement, {
       zoom: 14,
       center: this.start,
       zIndex: -1,
       mapTypeControl: environment.viewMapTypeControl,
       fullscreenControl: environment.viewfullscreenControl,
       ZoomControl: environment.viewZoomControl,
       streetViewControl: environment.viewstreetViewControl,
     });
     this.directionsDisplay.setMap(this.map);
     //creamos el marker a de tu posicion
     this.crearMarkerA(this.start, "Estas cerca de aquí", "./assets/imgs/pin_verde.png");
   }

   //las variables globales las seteamos en willenter
   setearVariables(){
    /* this.transporte = localStorage.getItem("transporte"); */
    this.transporte = sessionStorage.getItem("transporte");
    this.direccion = "direccion1";
    /* this.categoria = localStorage.getItem("categoria"); */
    this.categoria = sessionStorage.getItem("categoria");
  
    this.start = {
/*       lat: JSON.parse(localStorage.getItem("latitud")),
      lng: JSON.parse(localStorage.getItem("longitud")) */
      lat: JSON.parse(sessionStorage.getItem("latitud")),
      lng: JSON.parse(sessionStorage.getItem("longitud"))
    };

    /* this.lati = localStorage.getItem("latitud"); */
    this.lati = sessionStorage.getItem("latitud");
    this.latConComa = this.lati.replace(/\./gi, ",");
  
    /* this.longi = localStorage.getItem("longitud"); */
    this.longi = sessionStorage.getItem("longitud");
    this.longiConComa = this.longi.replace(/\./gi, ",");
  
    //variable de gravedad escogida por usuario
    /* this.gravedadUsuario = localStorage.getItem("gravedad"); */
    this.gravedadUsuario = sessionStorage.getItem("gravedad");



   }
   setearEstablecimientos(){
    var entidadVacia = {
      Nombre: 'No hay',
      Direccion: '',
      Telefonos: '',
      Latitud: 0,
      Longitud: 0,
      TiempoEspera: 0,
      EsRayen: true,
      HorarioLunVie: '0-0',
      HorarioSabDom: '0-0',
      ProcesarDirection: false
    }
     if (this.centros && this.centros.length <= 3){
      //son menos o igual a 3
      if (this.centros.length == 0){
        //esto ya esta manejado, pero sin embargo seteamos las variables igual
        //todos deben ir por defecto

        this.centros.push(entidadVacia);
        this.centros.push(entidadVacia);
        this.centros.push(entidadVacia);
      }
      if (this.centros.length == 1){
        this.centros[0].ProcesarDirection = true;
        this.centros.push(entidadVacia);
        this.centros.push(entidadVacia);
      }
      if (this.centros.length == 2){
        this.centros[0].ProcesarDirection = true;
        this.centros[1].ProcesarDirection = true;
        this.centros.push(entidadVacia);
      }
     }
     else {
      //vienen más de 3 ya procesados
      this.centros.forEach(centro => {
        centro.ProcesarDirection = true;
      });
     }
     //ahora hacemos el slice
    this.centrosMasCercanos = this.centros.slice(0, 3);
    this.nombreCentro1 = this.centrosMasCercanos[0].Nombre;
    this.nombreCentro2 = this.centrosMasCercanos[1].Nombre;
    this.nombreCentro3 = this.centrosMasCercanos[2].Nombre;

    this.largoNombreCentro1 = this.nombreCentro1.length;
    this.largoNombreCentro2 = this.nombreCentro2.length;
    this.largoNombreCentro3 = this.nombreCentro3.length;

    this.direccionCentro1 = this.centrosMasCercanos[0].Direccion;
    this.direccionCentro2 = this.centrosMasCercanos[1].Direccion;
    this.direccionCentro3 = this.centrosMasCercanos[2].Direccion;

    this.esRayen1 = this.centrosMasCercanos[0].EsRayen;
    this.esRayen2 = this.centrosMasCercanos[1].EsRayen;
    this.esRayen3 = this.centrosMasCercanos[2].EsRayen;

    this.tiempoEspera1 = this.centrosMasCercanos[0].TiempoEspera;
    this.tiempoEspera2 = this.centrosMasCercanos[1].TiempoEspera;
    this.tiempoEspera3 = this.centrosMasCercanos[2].TiempoEspera;

    this.destino1 = {
      lat: this.centrosMasCercanos[0].Latitud,
      lng: this.centrosMasCercanos[0].Longitud,
      ProcesarDirection: this.centros[0].ProcesarDirection
    };
    this.destino2 = {
      lat: this.centrosMasCercanos[1].Latitud,
      lng: this.centrosMasCercanos[1].Longitud,
      ProcesarDirection: this.centros[1].ProcesarDirection
    };
    this.destino3 = {
      lat: this.centrosMasCercanos[2].Latitud,
      lng: this.centrosMasCercanos[2].Longitud,
      ProcesarDirection: this.centros[2].ProcesarDirection
    };
   }

  ionViewWillEnter() {
    var vuelve = false;

    this.route.queryParams.subscribe(params => {
      //console.log(params);
      if (params && params.cancelar){
        vuelve = true;
      }
    });
    //ACA HAY QUE SETEAR EL OBJETO propaganda desde sessionstorage
    this.propaganda =   JSON.parse(sessionStorage.getItem('PROPAGANDA'));
    this.srcPropaganda = this.propaganda.RutaImagen;
    this.tituloPropaganda = this.propaganda.Titulo;
    this.subTituloPropaganda = this.propaganda.Subtitulo;
    this.largoTitulo = this.propaganda.Titulo.length;
    console.log(this.propaganda);

    if (!vuelve) {
      this.setearVariables();
      //aca debemos hacer la llamada a la api
      if (!this.utiles.isAppOnDevice()) {
        //web
        this.presentLoading();
      }
      else {
        //dispositivo
        this.presentLoadingNativePromesa();
      }
      //console.log('capturar movimiento');
    }

  }
  ngOnInit() {
    //console.log('oninit');
  }

  setEntrada(objetoSerializado){
    var token_id = '0';
    if (sessionStorage.getItem('TOKEN_ID')){
      token_id = sessionStorage.getItem('TOKEN_ID');
    }
    this.objetoMovimiento.VersionAppName = localStorage.getItem('version_app_name');
    this.objetoMovimiento.Plataforma = localStorage.getItem('plataforma');
    this.objetoMovimiento.VersionAppNumber = localStorage.getItem('version_number');
    this.objetoMovimiento.Token = localStorage.getItem('token_dispositivo');
    this.objetoMovimiento.Fecha = new Date();
    this.objetoMovimiento.ObjetoSerializado = objetoSerializado;
    this.objetoMovimiento.TokenId = token_id;
    sessionStorage.setItem('SERIALIZADO', JSON.stringify(this.objetoMovimiento));
    if (!this.utiles.isAppOnDevice()) {
      //web
      //llamada a la api
      this.geo.postEntrada(this.objetoMovimiento).subscribe(data=>{
        //console.log('movimiento guardado:' + data);
      });
    }
    else {
      //dispositivo
      //llamada a la api
      this.geo.postEntradaNative(this.objetoMovimiento).then((data: any)=>{
        //console.log('movimiento guardado nativo:' + data);
      });
    }
      
  }
  irAHome(){
    this.navCtrl.navigateForward('home');
  } 
  async redibujarRutaPromesa(direccion) {
    /* localStorage.setItem("transporte", this.transporte); */
    sessionStorage.setItem("transporte", this.transporte);

    let loader = await this.loading.create({
      message: 'Redibujando ruta...',
      duration: 5000
    });

    await loader.present().then(() => {
      //iconos dinámicos
      if (this.transporte == "WALKING") {
        this.iconTransporte = "walk";
      } else if (this.transporte == "DRIVING") {
        this.iconTransporte = "car";
      } else if (this.transporte == "TRANSIT") {
        this.iconTransporte = "bus";
      }

      this.calcularTiempoDestinoF(this.destino1);
      this.calcularTiempoDestinoF(this.destino2);
      this.calcularTiempoDestinoF(this.destino3);

      if (direccion == "direccion1") {
        direccion = this.destino1;
      } else if (direccion == "direccion2") {
        direccion = this.destino2;
      } else if (direccion == "direccion3") {
        direccion = this.destino3;
      }
      return this.promesaDirection(this.start, direccion, this.transporte);

    }).then((data: any)=>{
      this.directionsDisplay.setDirections(data);
    })
    ;

  }
  //Evento de cambio cuando se hace click a la barra superior
  async redibujarRuta(direccion) {
    /* localStorage.setItem("transporte", this.transporte); */
    sessionStorage.setItem("transporte", this.transporte);

    let loader = await this.loading.create({
      message: 'Redibujando ruta...',
      duration: 5000
    });

    await loader.present().then(() => {
      //iconos dinámicos
      if (this.transporte == "WALKING") {
        this.iconTransporte = "walk";
      } else if (this.transporte == "DRIVING") {
        this.iconTransporte = "car";
      } else if (this.transporte == "TRANSIT") {
        this.iconTransporte = "bus";
      }
      if (this.destino1.ProcesarDirection){
        this.calcularTiempoDestinoF(this.destino1);
      }
      if (this.destino2.ProcesarDirection){
        this.calcularTiempoDestinoF(this.destino2);
      }
      if (this.destino3.ProcesarDirection){
        this.calcularTiempoDestinoF(this.destino3);
      }
      
      

      if (direccion == "direccion1") {
        direccion = this.destino1;
      } else if (direccion == "direccion2") {
        direccion = this.destino2;
      } else if (direccion == "direccion3") {
        direccion = this.destino3;
      }

      this.directionsService.route({
        origin: this.start,
        destination: direccion,
        travelMode: this.transporte
      }, (response, status) => {
        if (status === 'OK') {
          //Trazamos la ruta
          this.directionsDisplay.setDirections(response);

          console.log(this.transporte + ' ' + response.routes[0].legs[0].duration.text);
        } else {
          // window.alert('Directions request failed due to ' + status);
        }
      });
    });

  }

  //Crear Markers con custom InfoWindow
  crearMarkerA(LatLng, nombre, url) {
    let contenido = nombre;
    var marker = new google.maps.Marker({
      position: LatLng,
      map: this.map,
      icon: url,
      title: nombre,
      zIndex: 9999
    });

    marker.addListener('click', () => {
      this.infoWindow.setContent(contenido);
      this.infoWindow.open(this.map, marker);
    });
  }

  crearMarkerB(LatLng, nombre, centro, esRayen) {
    let icono;
    let tiempoTiempoEsperaCategoria;
    var tipoConsultaStr = 'Pública';
    //console.log(LatLng.lat);
    if (sessionStorage.getItem('ES_PUBLICO')){
      this.esPublico = JSON.parse(sessionStorage.getItem('ES_PUBLICO'));
      if (!this.esPublico){
        tipoConsultaStr = 'Privada';
      }
    }

    if (esRayen == true) {
      icono = "./assets/imgs/pin_rojo.png";
      tiempoTiempoEsperaCategoria = centro.TiempoEspera + ' min';
      //console.log(tiempoTiempoEsperaCategoria);
    } else {
      icono = "./assets/imgs/pin_rojo.png";
      tiempoTiempoEsperaCategoria = "Sin dato";
      //console.log(tiempoTiempoEsperaCategoria);
    }

    let contenidoInfoWindow = '<div style="padding:8px;"' + '<b>' + nombre + '</b><br>' +
      centro.Direccion + '<br>' +
      '<b>Distancia: </b>' + this.distancia + '<br>' +
      '<b>Fono: </b>' + centro.Telefonos + '<br>' +
      '<b>Horario L-V: </b>' + centro.HorarioLunVie + '<br>' +
      '<b>Horario S-D: </b>' + centro.HorarioSabDom + '<br>' +
      '<b>Tiempo de espera: </b>' + tiempoTiempoEsperaCategoria + '<br>' +
      '<b>Tipo consulta: </b>' + tipoConsultaStr + '<br>' +
      //'<div class="derecha" id="myid"><b>Llévame ahí</b></div>';
      '<ion-badge color="primary" style="float: right;padding: 8px; margin:5px;"><div class="derecha" id="myid"><b>Llévame ahí</b></div></ion-badge></div>'

    var marker = new google.maps.Marker({
      position: LatLng,
      map: this.map,
      icon: icono,
      title: nombre,
      zIndex: 500
    });

    this.infoWindow.setContent(contenidoInfoWindow);
    this.infoWindow.setZIndex(500);
    this.infoWindow.open(this.map, marker);

    this.markers.push(marker);

    marker.addListener('click', () => {
      //alert('me dieron click');
      this.infoWindow.setContent(contenidoInfoWindow);
      this.infoWindow.setZIndex(500);
      this.infoWindow.open(this.map, marker);
    });
    // this.map.addListener('click', ()=>{
    //   this.infoWindow.close();
    // });


    //Funcion para tomar el id del elemento Llévame ahí, necesita estar dentro del scope
    google.maps.event.addListenerOnce(this.infoWindow, 'domready', () => {
      document.getElementById('myid').addEventListener('click', () => {
        let destination = LatLng.lat + ', ' + LatLng.lng;
        let options: LaunchNavigatorOptions = {
          start: ""
        };

        this.launchNavigator.navigate(destination, options)
          .then(
            success => alert('Launched navigator'),
            error => alert('Error launching navigator: ' + error)
          );
      });
    });

  }

  tiempoTransporteSuperior(mode, destino) {
    
    this.directionsService.route({
      origin: this.start,
      destination: destino,
      travelMode: mode
    }, (response, status) => {
      if (status === 'OK') {

        //Solo entregamos tiempo de desplazamiento, no volvemos a trazar la ruta
        if (mode == 'WALKING') {
          this.tiempoWalking = response.routes[0].legs[0].duration.text;
        }
        if (mode == 'DRIVING') {
          this.tiempoDriving = response.routes[0].legs[0].duration.text;
        }
        if (mode == 'TRANSIT') {
          this.tiempoTransit = response.routes[0].legs[0].duration.text;
        }

        //console.log(mode + ' ' + response.routes[0].legs[0].duration.text);
      } else {
        // window.alert('Directions request failed due to ' + status);
      }
    });
  }

  //Variables del tiempo de la barra inferior
  async calcularTiempoDestinoF(destino) {

/*     let loader = await this.loading.create({
      message: 'Calculando tiempo destino...',
      duration: 5000
    });

    await loader.present().then(() => { */
      this.directionsService.route({
        origin: this.start,
        destination: destino,
        travelMode: this.transporte
      }, (response, status) => {
        if (status === 'OK') {
  
          if (destino == this.destino1) {
            this.tiempoCentro1 = response.routes[0].legs[0].duration.text;
            //console.log('Destino 1: ' + this.tiempoCentro1);
          }
          if (destino == this.destino2) {
            this.tiempoCentro2 = response.routes[0].legs[0].duration.text;
            //console.log('Destino 2: ' + this.tiempoCentro2);
          }
          if (destino == this.destino3) {
            this.tiempoCentro3 = response.routes[0].legs[0].duration.text;
            //console.log('Destino 3: ' + this.tiempoCentro3);
          }
  
        } else {
          // window.alert('Directions request failed due to ' + status);
        }
      });
/*     }) */
    
  }

  //Evento de cambio cuando se hace click a la barra inferior
  async trazarNuevaRuta(direccion) {
    let loader = await this.loading.create({
      message: 'Trazando ruta...',
      duration: 5000
    });

    await loader.present().then(() => {
      //borra los markers anteriores
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];

      let nombreCentro;
      let centro;
      let esRayen;
      if (direccion == "direccion1") {
        direccion = this.destino1;
        nombreCentro = this.nombreCentro1;
        centro = this.centrosMasCercanos[0];
        esRayen = this.esRayen1;
      } else if (direccion == "direccion2") {
        direccion = this.destino2;
        nombreCentro = this.nombreCentro2;
        centro = this.centrosMasCercanos[1];
        esRayen = this.esRayen2;
      } else if (direccion == "direccion3") {
        direccion = this.destino3;
        nombreCentro = this.nombreCentro3;
        centro = this.centrosMasCercanos[2];
        esRayen = this.esRayen3;
      }

      this.directionsService.route({
        origin: this.start,
        destination: direccion,
        travelMode: this.transporte
      }, (response, status) => {
        if (status === 'OK') {
          //Trazamos la ruta
          this.directionsDisplay.setDirections(response);
          this.distancia = response.routes[0].legs[0].distance.text;

          this.crearMarkerB(direccion, nombreCentro, centro, esRayen);
          //agregados para ver si actualiza la lista de inmediato
          this.tiempoTransporteSuperior('WALKING', direccion);
          this.tiempoTransporteSuperior('DRIVING', direccion);
          this.tiempoTransporteSuperior('TRANSIT', direccion);

          //console.log(response);
        } else {
          // window.alert('Directions request failed due to ' + status);
        }
      });

/*       this.tiempoTransporteSuperior('WALKING', direccion);
      this.tiempoTransporteSuperior('DRIVING', direccion);
      this.tiempoTransporteSuperior('TRANSIT', direccion); */
    });
  }

  async trazarNuevaRutaPromesa(direccion) {
    let loader = await this.loading.create({
      message: 'Trazando ruta...',
      duration: 5000
    });
    let nombreCentro;
    let centro;
    let esRayen;

    await loader.present().then(() => {
      //borra los markers anteriores
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];

      if (direccion == "direccion1") {
        direccion = this.destino1;
        nombreCentro = this.nombreCentro1;
        centro = this.centrosMasCercanos[0];
        esRayen = this.esRayen1;
      } else if (direccion == "direccion2") {
        direccion = this.destino2;
        nombreCentro = this.nombreCentro2;
        centro = this.centrosMasCercanos[1];
        esRayen = this.esRayen2;
      } else if (direccion == "direccion3") {
        direccion = this.destino3;
        nombreCentro = this.nombreCentro3;
        centro = this.centrosMasCercanos[2];
        esRayen = this.esRayen3;
      }
      if (direccion.ProcesarDirection) {
        return this.promesaDirection(this.start, direccion, this.transporte);
      }


    }).then((data: any) => {
      this.directionsDisplay.setDirections(data);
      this.distancia = data.routes[0].legs[0].distance.text;

      this.crearMarkerB(direccion, nombreCentro, centro, esRayen);
      //agregados para ver si actualiza la lista de inmediato
      this.tiempoTransporteSuperior('WALKING', direccion);
      this.tiempoTransporteSuperior('DRIVING', direccion);
      this.tiempoTransporteSuperior('TRANSIT', direccion);
    })
    ;
  }

  async calculaTiempoTransporteF(mode){
    let loaderTT = await this.loading.create({
      message: 'Calculando tiempo destino...',
      duration: 5000
    });

    await loaderTT.present().then(() => {
      this.directionsService.route({
        origin: this.start,
        destination: this.destino1,
        travelMode: mode
      }, (response, status) => {
        if (status === 'OK') {

          if (mode == 'WALKING') {
            this.tiempoWalking = response.routes[0].legs[0].duration.text;
          }
          if (mode == 'DRIVING') {
            this.tiempoDriving = response.routes[0].legs[0].duration.text;
          }
          if (mode == 'TRANSIT') {
            this.tiempoTransit = response.routes[0].legs[0].duration.text;
          }

          console.log(mode + ' dentro de rutas' + ' ' + response.routes[0].legs[0].duration.text);
        } else {
          this.utiles.presentToast('No hay resultados para su ubicación geográfica', 'middle', 10000);
        }
      });
    })

  }
  verBuscador(){
    //this.navCtrl.push('BusquedaPage');
    this.navCtrl.navigateForward('busqueda');
  }

  calculaTiempoTransporteSinLoader(mode, guarda){

      this.directionsService.route({
        origin: this.start,
        destination: this.destino1,
        travelMode: mode
      }, (response, status) => {
        if (status === 'OK') {

          if (mode == 'WALKING') {
            this.tiempoWalking = response.routes[0].legs[0].duration.text;
          }
          if (mode == 'DRIVING') {
            this.tiempoDriving = response.routes[0].legs[0].duration.text;
          }
          if (mode == 'TRANSIT') {
            this.tiempoTransit = response.routes[0].legs[0].duration.text;
          }

          //console.log(mode + ' dentro de rutas' + ' ' + response.routes[0].legs[0].duration.text);
          if (guarda){
            var ruta = {
              distance: null,
              duration: null,
              end_adress: null,
              end_location: null,
              start_address: null,
              start_location: null,
              Transporte: null,
              Gravedad: null,
              Categoria: null,
            };
            if (response.routes){
              if (response.routes[0].legs){
                ruta.distance = response.routes[0].legs[0].distance;
                ruta.duration = response.routes[0].legs[0].duration;
                ruta.end_adress = response.routes[0].legs[0].end_adress;
                ruta.end_location = response.routes[0].legs[0].end_location;
                ruta.start_address = response.routes[0].legs[0].start_address;
                ruta.start_location = response.routes[0].legs[0].start_location;
              }
            }
            ruta.Transporte = mode;
            ruta.Gravedad = this.gravedadEnviar;
            ruta.Categoria = this.categoria;
            var objSer = {
              Centros: this.centrosMasCercanos,
              Latitud: this.latitudEnviar,
              Longitud: this.longitudEnviar,
              Busqueda: ruta
            }
            this.setEntrada(objSer);
          }
        } else {
          this.utiles.presentToast('No hay resultados para su ubicación geográfica', 'middle', 10000);
        }
      });

  }

}
