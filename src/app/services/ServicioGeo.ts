import { Injectable } from '@angular/core';
//import { Http, Headers } from '@angular/';
import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
//import { Environment } from '@ionic-native/google-maps';

@Injectable()
export class ServicioGeo{
  constructor(
    private http: HTTP,
    private httpClient: HttpClient
  ){
    //inicializamos los valores


  }
  postEntradaNative(objetoEntrada){
    //realizar la llamada post nativa
    const headers = new Headers;
    const body =
    {
      "IdDispositivo": objetoEntrada.Token,
      "VersionAppName": objetoEntrada.VersionAppName,
      "Plataforma": objetoEntrada.Plataforma,
      "VersionAppNumber": objetoEntrada.VersionAppNumber,
      "ObjetoSerializado": objetoEntrada.ObjetoSerializado,
      "TokenId": objetoEntrada.TokenId
    };

    let url = environment.API_ENDPOINT + 'HistorialApp';
    this.http.setDataSerializer('json');


    return this.http.post(url, body, {});
  }
  postEntrada(objetoEntrada){
    //realizar la llamada post a la api
    const body = JSON.stringify(
      {
        "IdDispositivo": objetoEntrada.Token,
        "VersionAppName": objetoEntrada.VersionAppName,
        "Plataforma": objetoEntrada.Plataforma,
        "VersionAppNumber": objetoEntrada.VersionAppNumber,
        "ObjetoSerializado": objetoEntrada.ObjetoSerializado,
        "TokenId": objetoEntrada.TokenId

      });

    let url = environment.API_ENDPOINT + 'HistorialApp';
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    httpHeaders.set('Access-Control-Allow-Origin', '*');
    httpHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    httpHeaders.set("Access-Control-Allow-Headers", "*");

    let options = { headers: httpHeaders };

    let data = this.httpClient.post(url, body, options);
    return data;

  }
  postIngreso(objetoEntrada){
    //realizar la llamada post a la api
    const body = JSON.stringify(
      {
        "IdDispositivo": objetoEntrada.Token,
        "VersionAppName": objetoEntrada.VersionAppName,
        "Plataforma": objetoEntrada.Plataforma,
        "VersionAppNumber": objetoEntrada.VersionAppNumber,
        "TipoOperacion": "0"
      });

    let url = environment.API_ENDPOINT + 'RegistroSession';
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    httpHeaders.set('Access-Control-Allow-Origin', '*');
    httpHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    httpHeaders.set("Access-Control-Allow-Headers", "*");

    let options = { headers: httpHeaders };

    let data = this.httpClient.post(url, body, options);
    return data;

  }
  postPropagandaNative(latitud, longitud, esPublico){
    //realizar la llamada post nativa
    const headers = new Headers;
    const body =
    {
      "Latitud": latitud,
      "Longitud": longitud,
      "EsPublico": esPublico
    };

    let url = environment.API_ENDPOINT + 'Propaganda';
    this.http.setDataSerializer('json');


    return this.http.post(url, body, {});
  }
  postPropaganda(latitud, longitud, esPublico){
    //realizar la llamada post a la api
    const body = JSON.stringify(
      {
        "Latitud": latitud,
        "Longitud": longitud,
        "EsPublico": esPublico
      });

    let url = environment.API_ENDPOINT + 'Propaganda';
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    httpHeaders.set('Access-Control-Allow-Origin', '*');
    httpHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    httpHeaders.set("Access-Control-Allow-Headers", "*");

    let options = { headers: httpHeaders };

    let data = this.httpClient.post(url, body, options);
    return data;

  }
  postIngresoNative(objetoEntrada){
    //realizar la llamada post nativa
    const headers = new Headers;
    const body =
    {
      "IdDispositivo": objetoEntrada.Token,
      "VersionAppName": objetoEntrada.VersionAppName,
      "Plataforma": objetoEntrada.Plataforma,
      "VersionAppNumber": objetoEntrada.VersionAppNumber,
      "TipoOperacion": "0"
    };

    let url = environment.API_ENDPOINT + 'RegistroSession';
    this.http.setDataSerializer('json');


    return this.http.post(url, body, {});
  }
  get(latitud, longitud, distancia, gravedad, esPublico){
    //const headersH = new Headers;
    const body = JSON.stringify(
        {
            Latitud: latitud, Longitud: longitud, Distancia: distancia, Gravedad: gravedad, EsPublico: esPublico 
        }
    );
    //headersH.append('Access-Control-Allow-Origin', '*');

    let url = environment.API_ENDPOINT + 'Geolocalizacion';
    let httpHeaders = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Cache-Control': 'no-cache'
    });
    httpHeaders.set('Access-Control-Allow-Origin', '*');
    httpHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    httpHeaders.set("Access-Control-Allow-Headers", "*");

    let options = { headers: httpHeaders };

    let data = this.httpClient.post(url, body, options);
    return data;
  }
  async getNative(latitud, longitud, distancia, gravedad, esPublico){
    const headers = new Headers;
    const body = JSON.stringify(
        {
            Latitud: latitud, Longitud: longitud, Distancia: distancia, Gravedad: gravedad, EsPublico: esPublico  
        }
    );
    /*headers.append('Access-Control-Allow-Origin', '*');*/
    let url = environment.API_ENDPOINT + 'Geolocalizacion';
    let httpHeaders = new HttpHeaders({
        'Content-Type' : 'application/json',
        'Cache-Control': 'no-cache'
    });

    const response = await this.http.post(url, body, headers);
    return JSON.parse(response.data);

  }
  getMapaWeb(lat, lon){
    //https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
    //&location_type=ROOFTOP&result_type=street_address
    //let url corta
    //let urlCorta = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon +'&location_type=ROOFTOP&result_type=street_address&key=' + environment.API_KEY_MAPA;
    //let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon +'&key=' + environment.API_KEY_MAPA;
    let urlCorta = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon +'&location_type=APPROXIMATE&key=' + environment.API_KEY_MAPA;
    let data = this.httpClient.get(urlCorta,{});
    return data;
  }
  getMapaNative(lat, lon){
    //ojo, esta llamada que indica 'ROOFTOP' y result_type=street_address retorna un punto exacto
    //para hacer que retorne un punto aproximado debe idicar solo location_type=APROXIMATE
    //Ver la siguiente url de la documentación https://developers.google.com/maps/documentation/geocoding/intro
    //let urlCorta = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon +'&location_type=ROOFTOP&result_type=street_address&key=' + environment.API_KEY_MAPA;
    let urlCorta = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon +'&location_type=APPROXIMATE&key=' + environment.API_KEY_MAPA;
    let data = this.http.get(urlCorta, {}, {});
    return data;
  }
  getMapaNativeJson(lat, lon){
    //let urlCorta = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon +'&location_type=ROOFTOP&result_type=street_address&key=' + environment.API_KEY_MAPA;
    let urlCorta = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon +'&location_type=APPROXIMATE&key=' + environment.API_KEY_MAPA;
    let data = this.http.get(urlCorta, {}, {});
    return data;
  }
  getRegistroApp(idDispositivo){
    let url = environment.API_ENDPOINT + 'RegistroApp?IdDispositivo=' + idDispositivo;
    let data = this.httpClient.get(url,{});
    return data;
  }
  getRegistroAppNative(idDispositivo){
    let url = environment.API_ENDPOINT + 'RegistroApp?IdDispositivo=' + idDispositivo;
    let data = this.http.get(url,{}, {});
    return data;
  }
  //ya viene en formato objeto
  postRegistro(objetoRegistro){
    //realizar la llamada post a la api
    const body = JSON.stringify(objetoRegistro);

    let url = environment.API_ENDPOINT + 'RegistroApp';
    let httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    httpHeaders.set('Access-Control-Allow-Origin', '*');
    httpHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    httpHeaders.set("Access-Control-Allow-Headers", "*");

    let options = { headers: httpHeaders };

    let data = this.httpClient.post(url, body, options);
    return data;

  }
  postRegistroNative(objetoRegistro){
    //realizar la llamada post a la api
    const headers = new Headers;
    const body = objetoRegistro;


    let url = environment.API_ENDPOINT + 'RegistroApp';
    this.http.setDataSerializer('json');


    return this.http.post(url, body, {});

  }

}