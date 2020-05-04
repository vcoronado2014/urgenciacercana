import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, ToastController, Platform, ModalController, LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device/ngx';
//servicios
import { ServicioUtiles } from '../../app/services/ServicioUtiles';
//google
declare var google;

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.page.html',
  styleUrls: ['./busqueda.page.scss'],
})
export class BusquedaPage implements OnInit {
  categoria:any = sessionStorage.getItem("categoria");
  autocompleteItems;
  autocomplete;
  miLocation:boolean = false;
  service = new google.maps.places.AutocompleteService();
  cargando = false;
  latPagina;
  lonPagina;

  constructor(
    public navCtrl: NavController,
    public toast: ToastController,
    public modalCtrl: ModalController,
    public platform: Platform,
    public geolocation: Geolocation,
    public device: Device,
    public utiles: ServicioUtiles,
    public loading: LoadingController,
    private zone: NgZone,

  ) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
   }

  ngOnInit() {
  }
  irAHome(){
    var latLon = {
      lat: this.latPagina,
      lng: this.lonPagina
    }
    this.navCtrl.navigateForward('home', { queryParams: latLon }  );
  } 

  async updateSearch() {

    
      this.miLocation=false;
      if (this.autocomplete.query == '') {
        this.autocompleteItems = [];
        return;
      }

      //await loader.present().then(() => {
        let me = this;
        this.service.getPlacePredictions({
          input: this.autocomplete.query,
          componentRestrictions: {
            country: 'cl'
          }
        }, (predictions, status) => {
          me.autocompleteItems = [];

          me.zone.run(() => {
            if (predictions != null) {
              this.cargando = true;
              //console.log(this.cargando);
              predictions.forEach((prediction) => {
                me.autocompleteItems.push(prediction.description);
                //loader.dismiss();
              });
              this.cargando = false;
              //console.log(this.cargando);
            }
          });
        });


  }
  chooseItem(item: any) {
    //this.viewCtrl.dismiss(item);
    //this.geo = item;
    //console.log(item);
    this.geoCode(item);//convert Address to lat and long
  }
  geoCode(address:any) {
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'address': address }, (results, status) => {
      let latitude = results[0].geometry.location.lat();
      let longitude = results[0].geometry.location.lng();
      sessionStorage.setItem("latitud", JSON.stringify(latitude));
      sessionStorage.setItem("longitud", JSON.stringify(longitude));

      if(latitude != null && longitude!= null){
        //this.viewCtrl.dismiss();
        //lo reemplazamos por el cierre del modal
        this.pushPage();
        //this.dismiss();
      }
    });
  }

  myLocation(){
    this.miLocation = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      //variables para detrminar que debe usar la pagina de home
      this.lonPagina = JSON.stringify(resp.coords.longitude);
      this.latPagina = JSON.stringify(resp.coords.latitude);
      //****************************************************** */
      sessionStorage.setItem("latitud", JSON.stringify(resp.coords.latitude));
      sessionStorage.setItem("longitud", JSON.stringify(resp.coords.longitude));
      //lo reemplazamos por el cierre del modal
      this.pushPage();
      //this.dismiss();
      //console.log("ubicacion actual");
    }).catch((error) => {
      //console.log('Error getting location', error);
    })
    
    // if(this.miLocation){
    //   this.navCtrl.push('MapaTestPage');
    // }
  }

  pushPage(){
    var latLon = { 
      lat: this.latPagina,
      lng: this.lonPagina
    }
    this.navCtrl.navigateForward('mapa-test', { queryParams: latLon});
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
