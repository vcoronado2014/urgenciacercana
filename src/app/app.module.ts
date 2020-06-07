import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
//nativos
import { AppVersion } from '@ionic-native/app-version/ngx'
import { Network } from '@ionic-native/network/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { GoogleMaps, Geocoder } from '@ionic-native/google-maps';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
//componentes
import { ModalVistaPageModule } from './modal-vista/modal-vista.module';
import { ErrorPageModule } from './error/error.module';
import { MapaTestPageModule } from './mapa-test/mapa-test.module';
import { GravedadPageModule } from './gravedad/gravedad.module';
import { LoginPageModule } from './login/login.module';
import { BusquedaPageModule } from './busqueda/busqueda.module';
import { BusquedaPage } from './busqueda/busqueda.page'
import { DetallePropagandaPageModule } from './detalle-propaganda/detalle-propaganda.module';
import { DetallePropagandaPage } from './detalle-propaganda/detalle-propaganda.page'

//servicios
import { ServicioGeo } from './services/ServicioGeo'
import { ServicioUtiles } from './services/ServicioUtiles'
//components
import { PopoverComponent } from '../app/components/popover/popover.component';


@NgModule({
  declarations: [AppComponent, PopoverComponent],
  entryComponents: [ 
    PopoverComponent,
    BusquedaPage,
    DetallePropagandaPage,
  ],
  imports: [
    ModalVistaPageModule,
    ErrorPageModule,
    MapaTestPageModule,
    GravedadPageModule,
    LoginPageModule,
    BusquedaPageModule,
    DetallePropagandaPageModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(), 
    AppRoutingModule,

  ],
  providers: [
    StatusBar,
    InAppBrowser,
    SplashScreen,
    AppVersion,
    Network,
    LocationAccuracy,
    GoogleMaps,
    Geocoder,
    ServicioGeo,
    Geolocation,
    LaunchNavigator,
    ServicioUtiles,
    HTTP,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
