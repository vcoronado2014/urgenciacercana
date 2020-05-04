import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import * as moment from 'moment';
import { environment } from '../../environments/environment';


@Injectable()
export class ServicioUtiles{
    plataforma;
	versionAppName;
    versionNumber;
    infoAplicacion = {
        VersionAppName: '',
        VersionNumnber: '',
        Plataforma: ''
    }
    pais;
    provincia;
    region;
    comuna;
    
    constructor(
        public platform : Platform,
        public appVersion: AppVersion,
        public toast: ToastController,
    ){
      //inicializamos los valores
      moment.locale('es');
  
    }
    entregaFechaHoraActual(){
        return moment();
    }
    rutaAceptoCondiciones(){
        //var url = environment.API_ENDPOINT.replace(/\/Api/g, "/aceptocondiciones.pdf");
        var url = environment.API_ENDPOINT.replace(/\/Api/g, "");
        url = url + "/aceptocondiciones.pdf";
        return url;
    }
    private transformaFecha(strElemento){
        //var actual = moment().add('hour', 8);
        var actual = moment();
        var retorno = false;
        var inicio = null;
        var termino = null;
        var dia = moment().date();
        var mes = moment().month();
        var anio = moment().year();
        var diaT = moment().date();
        var mesT = moment().month();
        var anioT = moment().year();

        switch (strElemento){
            case "08 AM - 20 PM":
                //inicio = new Date(anio, mes, dia, 8, 0, 0, 0);
                inicio = moment([anio, mes, dia, 8, 0, 0, 0]);
                termino= moment([anio, mes, dia, 20, 0, 0, 0]);
                //console.log('inicio: ' + moment(inicio).format('YYYY-MM-DD HH:mm') + ' termino: ' + moment(termino).format('YYYY-MM-DD HH:mm'));
                //console.log(' Esta? ' + actual.isBetween(inicio, termino));
                retorno = actual.isBetween(inicio, termino);
                break;
            case "20 PM - 08 AM":
                inicio = moment([anio, mes, dia, 20, 0, 0, 0]);
                termino= moment(inicio).add(12, 'hours');
                //console.log('inicio: ' + moment(inicio).format('YYYY-MM-DD HH:mm') + ' termino: ' + moment(termino).format('YYYY-MM-DD HH:mm'));
                //console.log(' Esta? ' + actual.isBetween(inicio, termino));
                retorno = actual.isBetween(inicio, termino);
                break;
            case "17 PM - 24 PM":
                inicio = moment([anio, mes, dia, 17, 0, 0, 0]);
                termino= moment(inicio).add(8, 'hours');
                //console.log('inicio: ' + moment(inicio).format('YYYY-MM-DD HH:mm') + ' termino: ' + moment(termino).format('YYYY-MM-DD HH:mm'));
                //console.log(' Esta? ' + actual.isBetween(inicio, termino));
                retorno = actual.isBetween(inicio, termino);
                break;
            case "17 PM - 08 AM":
                inicio = moment([anio, mes, dia, 17, 0, 0, 0]);
                termino= moment(inicio).add(16, 'hours');
                //console.log('inicio: ' + moment(inicio).format('YYYY-MM-DD HH:mm') + ' termino: ' + moment(termino).format('YYYY-MM-DD HH:mm'));
                //console.log(' Esta? ' + actual.isBetween(inicio, termino));
                retorno = actual.isBetween(inicio, termino);
                break;
            case "08 AM - 14 PM":
                inicio = moment([anio, mes, dia, 8, 0, 0, 0]);
                termino= moment([anio, mes, dia, 14, 0, 0, 0]);
                //console.log('inicio: ' + moment(inicio).format('YYYY-MM-DD HH:mm') + ' termino: ' + moment(termino).format('YYYY-MM-DD HH:mm'));
                //console.log(' Esta? ' + actual.isBetween(inicio, termino));
                retorno = actual.isBetween(inicio, termino);
                break; 
            case "08 AM - 17 PM":
                inicio = moment([anio, mes, dia, 8, 0, 0, 0]);
                termino= moment([anio, mes, dia, 17, 0, 0, 0]);
                //console.log('inicio: ' + moment(inicio).format('YYYY-MM-DD HH:mm') + ' termino: ' + moment(termino).format('YYYY-MM-DD HH:mm'));
                //console.log(' Esta? ' + actual.isBetween(inicio, termino));
                retorno = actual.isBetween(inicio, termino);
                break;    
            case "08 AM - 24 HRS":
                //inicio = new Date(anio, mes, dia, 8, 0, 0, 0);
                inicio = moment([anio, mes, dia, 8, 0, 0, 0]);
                termino= moment([anio, mes, dia, 23, 59, 0, 0]);
                //console.log('inicio: ' + moment(inicio).format('YYYY-MM-DD HH:mm') + ' termino: ' + moment(termino).format('YYYY-MM-DD HH:mm'));
                //console.log(' Esta? ' + actual.isBetween(inicio, termino));
                retorno = actual.isBetween(inicio, termino);
                break;                             
            case "24 HRS":
                retorno = true;
                break;
            //este campo es null en la base de datos y esta en sabado y domingos
            //por lo tanto devolvemos falso
            case "0":
                retorno = false;
                break;
            default:
                retorno = true;
                break;
        }
        return retorno;
    }
    procesaFechaHoraTermino(arrEstablecimientos){
/*         
let arr =
        [
            {
                "Nombre": "Centro de Salud Vival Ltda.",
                "Direccion": "Monjitas 843",
                "Telefonos": "226305500",
                "Latitud": -33.436955,
                "Longitud": -70.648935,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Hernández y Gutiérrez Ltda",
                "Direccion": "Libertador Bernardo OHiggins 776",
                "Telefonos": "226388846",
                "Latitud": -33.443284,
                "Longitud": -70.646988,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "20 PM - 08 AM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Integramédica Forestal",
                "Direccion": "Alameda 654",
                "Telefonos": "223536800",
                "Latitud": -33.443088,
                "Longitud": -70.645705,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "17 PM - 24 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Clínica Dávila",
                "Direccion": "Recoleta 464",
                "Telefonos": "227308151",
                "Latitud": -33.427257,
                "Longitud": -70.648544,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Recoleta"
            },
            {
                "Nombre": "Centro de Salud La Araucana Salud",
                "Direccion": "Merced 472",
                "Telefonos": "229645751",
                "Latitud": -33.437944,
                "Longitud": -70.643933,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro de Salud Vida Integra Bandera",
                "Direccion": "Bandera 101",
                "Telefonos": "222333700",
                "Latitud": -33.441929,
                "Longitud": -70.651903,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Integramédica Bandera",
                "Direccion": "Bandera 162",
                "Telefonos": "226366666",
                "Latitud": -33.441528,
                "Longitud": -70.652402,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Clínica Central",
                "Direccion": "San Isidro 231",
                "Telefonos": "224631400",
                "Latitud": -33.44655,
                "Longitud": -70.64403,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Integramédica",
                "Direccion": "Huérfanos 1147",
                "Telefonos": "226923300",
                "Latitud": -33.439526,
                "Longitud": -70.652881,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro de Salud Diagnostiko Ltda",
                "Direccion": "Victoria Subercaseaux 121",
                "Telefonos": "226328076",
                "Latitud": -33.439095,
                "Longitud": -70.642253,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Médico y Dental Servicio de Bienestar MOP",
                "Direccion": "Morandé 59",
                "Telefonos": "224493355",
                "Latitud": -33.443018,
                "Longitud": -70.653049,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Clínica Universidad Católica",
                "Direccion": "Lira 40",
                "Telefonos": "223696000",
                "Latitud": -33.442159,
                "Longitud": -70.641311,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Hospital Clínico Universidad de Chile",
                "Direccion": "Santos Dumond 999",
                "Telefonos": "229788551",
                "Latitud": -33.420057,
                "Longitud": -70.653116,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Independencia"
            },
            {
                "Nombre": "Hospital Clínico Universidad Católica",
                "Direccion": "Marcoleta 367",
                "Telefonos": "223543103",
                "Latitud": -33.442233,
                "Longitud": -70.640349,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Médico y Dental Fundación Asistencial Trabajadores Del Banco del Estado de Chile",
                "Direccion": "Almirante Lorenzo Gotuzzo 70",
                "Telefonos": "223479000",
                "Latitud": -33.442973,
                "Longitud": -70.655523,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro de Salud Mutual CChC Agustinas",
                "Direccion": "Agustinas 1365",
                "Telefonos": "228765700",
                "Latitud": -33.441165,
                "Longitud": -70.655942,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Clínica Pedro Montt",
                "Direccion": "Lord Cochrane 779",
                "Telefonos": "226886452",
                "Latitud": -33.455205,
                "Longitud": -70.653762,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Asistencial AChS Santiago",
                "Direccion": "Agustinas 1428",
                "Telefonos": "225657200",
                "Latitud": -33.441492,
                "Longitud": -70.656611,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Médico y Dental Megasalud Alameda",
                "Direccion": "Libertador Bernardo OHiggins 1511",
                "Telefonos": "224257000",
                "Latitud": -33.444915,
                "Longitud": -70.657657,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Clínica Juan Pablo II",
                "Direccion": "Santa Rosa 1448",
                "Telefonos": "224835100",
                "Latitud": -33.46365,
                "Longitud": -70.64262,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Nueva Clínica Madre e Hijo",
                "Direccion": "Santa Rosa 1503",
                "Telefonos": "226594300",
                "Latitud": -33.464904,
                "Longitud": -70.642647,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Clínica Santa Inés",
                "Direccion": "Arturo Prat 1840",
                "Telefonos": "225569036",
                "Latitud": -33.47013,
                "Longitud": -70.64665,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Médico Vida Integra Alameda",
                "Direccion": "Alameda 1620",
                "Telefonos": "224107400",
                "Latitud": -33.446412,
                "Longitud": -70.658798,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Red Salud Santiago ex Clínica Bicentenario",
                "Direccion": "Libertador Bernardo OHiggins 4850",
                "Telefonos": "229983435",
                "Latitud": -33.43709,
                "Longitud": -70.63562,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Estacion Central"
            },
            {
                "Nombre": "Policlínico Institucional de Gendarmería de Chile - Santiago",
                "Direccion": "Artemio Gutiérrez 1173",
                "Telefonos": "224826800",
                "Latitud": -33.458241,
                "Longitud": -70.637759,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Dilab",
                "Direccion": "Vicuña Mackenna, Piso 1 6",
                "Telefonos": "222223112",
                "Latitud": -33.437953,
                "Longitud": -70.634743,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Hospital Clínico Instituto de Seguridad del Trabajo de Santaigo",
                "Direccion": "Placer 1410",
                "Telefonos": "228107800",
                "Latitud": -33.475925,
                "Longitud": -70.651674,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Clínica Sierra Bella",
                "Direccion": "Sierra Bella 1181",
                "Telefonos": "227501200",
                "Latitud": -33.46268,
                "Longitud": -70.63555,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Médico HTS SpA",
                "Direccion": "Vicuña Mackenna 210",
                "Telefonos": "226853763",
                "Latitud": -33.444151,
                "Longitud": -70.63295,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Establecimiento Penitenciario Santiago 1",
                "Direccion": "Nueva Centenario 1978",
                "Telefonos": "979451228",
                "Latitud": -33.475857,
                "Longitud": -70.656574,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Médico Vivaceta",
                "Direccion": "Vivaceta 957",
                "Telefonos": "229770220",
                "Latitud": -33.419853,
                "Longitud": -70.663067,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Independencia"
            },
            {
                "Nombre": "Clínica Astra Independencia",
                "Direccion": "Hipódromo Chile 1520",
                "Telefonos": "227374809",
                "Latitud": -33.407305,
                "Longitud": -70.661283,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Independencia"
            },
            {
                "Nombre": "Centro Asistencial AChS San Miguel",
                "Direccion": "Alcalde 970",
                "Telefonos": "225544399",
                "Latitud": -33.486876,
                "Longitud": -70.647989,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "San Miguel"
            },
            {
                "Nombre": "Hospital Penitenciario",
                "Direccion": "Pedro Montt 1902",
                "Telefonos": "225544018",
                "Latitud": -33.473594,
                "Longitud": -70.660323,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "SAPU Cristo Vive",
                "Direccion": "Recoleta 4125",
                "Telefonos": "226226380",
                "Latitud": -33.386767,
                "Longitud": -70.641561,
                "TiempoEspera": 0,
                "EsRayen": true,
                "HorarioLunVie": "17 PM - 08 AM",
                "HorarioSabDom": "08 AM - 20 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Recoleta"
            },
            {
                "Nombre": "Centro Integramédica San Miguel",
                "Direccion": "El Llano Subercaseaux 3965",
                "Telefonos": "226367445",
                "Latitud": -33.489979,
                "Longitud": -70.652032,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "San Miguel"
            },
            {
                "Nombre": "Multimédica Ltda.",
                "Direccion": "Llano Subercaseaux 4005",
                "Telefonos": "225514611",
                "Latitud": -33.490566,
                "Longitud": -70.652185,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "San Miguel"
            },
            {
                "Nombre": "Clínica Indisa",
                "Direccion": "Santa María 1810",
                "Telefonos": "223625397",
                "Latitud": -33.43333,
                "Longitud": -70.62855,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica Santa María",
                "Direccion": "Santa María 410",
                "Telefonos": "224613510",
                "Latitud": -33.43282,
                "Longitud": -70.62822,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Centro Servicios Médicos Santa María",
                "Direccion": "Santa María 410",
                "Telefonos": "224613590",
                "Latitud": -33.432418,
                "Longitud": -70.628116,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica Cima Salud",
                "Direccion": "Gran Avenida José Miguel Carrera 4564",
                "Telefonos": "223989000",
                "Latitud": -33.495624,
                "Longitud": -70.652403,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "San Miguel"
            },
            {
                "Nombre": "Diagnóstika",
                "Direccion": "Salvador 135",
                "Telefonos": "",
                "Latitud": -33.43499,
                "Longitud": -70.626325,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Megasalud",
                "Direccion": "Salvador 100",
                "Telefonos": "223695100",
                "Latitud": -33.434342,
                "Longitud": -70.625991,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Red Salud Providencia ex Clínica Avansalud Providencia",
                "Direccion": "Salvador 100",
                "Telefonos": "223662055",
                "Latitud": -33.43482,
                "Longitud": -70.62584,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica Santa Rosa",
                "Direccion": "Copacabana 493",
                "Telefonos": "225524816",
                "Latitud": -33.492674,
                "Longitud": -70.635559,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "San Joaquin"
            },
            {
                "Nombre": "Elsa",
                "Direccion": "Italia 1056",
                "Telefonos": "224763100",
                "Latitud": -33.444389,
                "Longitud": -70.625433,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica Las Acacias",
                "Direccion": "Salvador 537",
                "Telefonos": "222237977",
                "Latitud": -33.43878,
                "Longitud": -70.62518,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Centro de Salud Mutual CChC Providencia",
                "Direccion": "Hernán Alessandri 620",
                "Telefonos": "222254242",
                "Latitud": -33.434965,
                "Longitud": -70.624768,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Mirandes S.P.A.",
                "Direccion": "Salvador 726",
                "Telefonos": "226119550",
                "Latitud": -33.44015,
                "Longitud": -70.62442,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica Corporación de Ayuda al Paciente Mental",
                "Direccion": "Condell 1890",
                "Telefonos": "222336970",
                "Latitud": -33.451727,
                "Longitud": -70.624283,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Ñuñoa"
            },
            {
                "Nombre": "Clínica Astra Providencia",
                "Direccion": "Rancagua 701",
                "Telefonos": "222741377",
                "Latitud": -33.43968,
                "Longitud": -70.62347,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Centro Médico y Dental Megasalud Gran Avenida",
                "Direccion": "Gran Avenida José Miguel Carrera 5728",
                "Telefonos": "224257500",
                "Latitud": -33.5066,
                "Longitud": -70.655096,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "San Miguel"
            },
            {
                "Nombre": "Clínica Oncológica Arturo López Pérez",
                "Direccion": "Rancagua 878",
                "Telefonos": "224457278",
                "Latitud": -33.43913,
                "Longitud": -70.62242,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica San Andrés",
                "Direccion": "Los Jesuitas 695",
                "Telefonos": "222055344",
                "Latitud": -33.4446,
                "Longitud": -70.6223,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Centro Vida Integra de San Miguel",
                "Direccion": "Gran Avenida José Miguel Carrera 6251",
                "Telefonos": "224107400",
                "Latitud": -33.513077,
                "Longitud": -70.657973,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "San Miguel"
            },
            {
                "Nombre": "Centro Médico y Dental Megasalud Conchalí",
                "Direccion": "Fermin Vivaceta 3161",
                "Telefonos": "224609317",
                "Latitud": -33.39864,
                "Longitud": -70.672418,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Conchalí"
            },
            {
                "Nombre": "Clínica de Medicina y Estética MYE",
                "Direccion": "Pérez Valenzuela 1551",
                "Telefonos": "222358146",
                "Latitud": -33.42517,
                "Longitud": -70.61953,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Centro Médico Manuel Montt ex Centro Clínico Integral Las Lilas",
                "Direccion": "Manuel Montt 427",
                "Telefonos": "222726944",
                "Latitud": -33.432144,
                "Longitud": -70.618483,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Instituto de Enfermedades Circulatorias",
                "Direccion": "Miguel Claro 988",
                "Telefonos": "227140600",
                "Latitud": -33.438456,
                "Longitud": -70.618338,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica Miguel Claro",
                "Direccion": "Miguel Claro 988",
                "Telefonos": "222649487",
                "Latitud": -33.438311,
                "Longitud": -70.618322,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Clínica de Cirugía y Estética Edelweiss",
                "Direccion": "Calle Miguel Claro 996",
                "Telefonos": "229183695",
                "Latitud": -33.438456,
                "Longitud": -70.618282,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "24 HRS",
                "HorarioSabDom": "24 HRS",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Centro Médico y Dental Matucana",
                "Direccion": "Matucana, Piso 2 727",
                "Telefonos": "226813942",
                "Latitud": -33.436958,
                "Longitud": -70.679959,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro de Salud Omega",
                "Direccion": "Matucana 727",
                "Telefonos": "226813942",
                "Latitud": -33.436962,
                "Longitud": -70.680018,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Santiago"
            },
            {
                "Nombre": "Centro Médico y Dental Antonio Varas del Banco del Estado de Chile",
                "Direccion": "Providencia 1722",
                "Telefonos": "222351440",
                "Latitud": -33.426086,
                "Longitud": -70.615578,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
            {
                "Nombre": "Centro Médico y Dental ISP",
                "Direccion": "Marathon 1000",
                "Telefonos": "225755241",
                "Latitud": -33.464262,
                "Longitud": -70.614717,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Ñuñoa"
            },
            {
                "Nombre": "Nefrolab",
                "Direccion": "Celia Zegers 141",
                "Telefonos": "225484166",
                "Latitud": -33.532417,
                "Longitud": -70.661224,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "La Cisterna"
            },
            {
                "Nombre": "Centro Médico y Dental Megasalud Providencia",
                "Direccion": "11 de Septiembre 1920",
                "Telefonos": "224317200",
                "Latitud": -33.425073,
                "Longitud": -70.613175,
                "TiempoEspera": 0,
                "EsRayen": false,
                "HorarioLunVie": "08 AM - 20 PM",
                "HorarioSabDom": "08 AM - 14 PM",
                "Region": "XIII Región Metropolitana",
                "Comuna": "Providencia"
            },
        ]; 
        */
        var arrRetorno = [];
        var diaSemana = moment().day();
        var esFestivo = false;
        if (diaSemana == 0 || diaSemana == 6){
            esFestivo = true;
        }
        //dias semana 0=domingo, 1 lunes, 2 martes, 3 miercoles, 4 jueves, 5 viernes, 6 sabado
        //contamos los registros
        //console.log('total registros inicial ' + arrEstablecimientos.length);
        if (arrEstablecimientos && arrEstablecimientos.length > 0){
            arrEstablecimientos.forEach(estableicmiento => {
                if (!esFestivo){
                    if (this.transformaFecha(estableicmiento.HorarioLunVie)){
                        //agregar el elemento ya que esta dentro del horario
                        arrRetorno.push(estableicmiento);
                    }
                }
                else {
                    if (this.transformaFecha(estableicmiento.HorarioSabDom)){
                        //agregar el elemento ya que esta dentro del horario
                        arrRetorno.push(estableicmiento);
                    }
                }

            });
        }
        //console.log('total final ' + arrRetorno.length);
        arrEstablecimientos = arrRetorno;
        return arrEstablecimientos;

    }
    isIOS(){
        return this.platform.is('ios');
    }
    getPlataform() {
        if (this.platform.is('ios')) {
            this.plataforma = "iOS";
        }
        else if (this.platform.is('android')) {
            this.plataforma = "Android";
        }
        else if (this.platform.is('capacitor')) {
            this.plataforma = "Capacitor";
        }
        else if (this.platform.is('cordova')) {
            this.plataforma = "Cordova";
        }
        else if (this.platform.is('desktop')) {
            this.plataforma = "Pc";
        }
        else if (this.platform.is('electron')) {
            this.plataforma = "Electron";
        }
        else if (this.platform.is('hybrid')) {
            this.plataforma = "Hibrido";
        }
        else if (this.platform.is('ipad')) {
            this.plataforma = "Ipad";
        }
        else if (this.platform.is('iphone')) {
            this.plataforma = "Iphone";
        }
        else if (this.platform.is('mobile')) {
            this.plataforma = "Mobile";
        }
        else if (this.platform.is('phablet')) {
            this.plataforma = "Pablet";
        }
        else if (this.platform.is('tablet')) {
            this.plataforma = "Tablet";
        }
        else if (this.platform.is('mobileweb')) {
            this.plataforma = "Web";
        }
         return this.plataforma;
    }

    getVersionNumber() {
        if (this.platform.is('ios')) {
            this.plataforma = "iOS";
        }
        else if (this.platform.is('android')) {
            this.plataforma = "Android";
        }
        else if (this.platform.is('capacitor')) {
            this.plataforma = "Capacitor";
        }
        else if (this.platform.is('cordova')) {
            this.plataforma = "Cordova";
        }
        else if (this.platform.is('desktop')) {
            this.plataforma = "Pc";
        }
        else if (this.platform.is('electron')) {
            this.plataforma = "Electron";
        }
        else if (this.platform.is('hybrid')) {
            this.plataforma = "Hibrido";
        }
        else if (this.platform.is('ipad')) {
            this.plataforma = "Ipad";
        }
        else if (this.platform.is('iphone')) {
            this.plataforma = "Iphone";
        }
        else if (this.platform.is('mobile')) {
            this.plataforma = "Mobile";
        }
        else if (this.platform.is('phablet')) {
            this.plataforma = "Pablet";
        }
        else if (this.platform.is('tablet')) {
            this.plataforma = "Tablet";
        }
        else if (this.platform.is('mobileweb')) {
            this.plataforma = "Web";
        }
        try {
            this.versionAppName = this.appVersion.getAppName();
            this.versionNumber = this.appVersion.getVersionNumber();
            
            this.infoAplicacion.Plataforma = this.plataforma;
            this.infoAplicacion.VersionAppName = this.versionAppName;
            this.infoAplicacion.VersionNumnber = this.versionNumber;
        }
        catch(error){
            this.infoAplicacion.Plataforma = this.plataforma;
            this.infoAplicacion.VersionAppName = '';
            this.infoAplicacion.VersionNumnber = '';
        }

        return this.infoAplicacion;
    }

	isAppOnDevice(): boolean {
		if (window.location.port === '8100') {
			return false;
		} else {
			return true;
		}
    }
    retornaAnios(){
        var arrAnios = [];
        var anoActual = new Date().getFullYear();
        for(var s=1900; s<=parseInt(anoActual.toString()); s++){
            arrAnios.push(s.toString());
        }
        return arrAnios;
    }
    retornaMeses(){
        var arrMeses = [
            {
                Nombre: 'Enero',
                Valor: '01',
                ValorInt: 1
            },
            {
                Nombre: 'Febrero',
                Valor: '02',
                ValorInt: 2
            },
            {
                Nombre: 'Marzo',
                Valor: '03',
                ValorInt: 3
            },
            {
                Nombre: 'Abril',
                Valor: '04',
                ValorInt: 4
            },
            {
                Nombre: 'Mayo',
                Valor: '05',
                ValorInt: 5
            },
            {
                Nombre: 'Junio',
                Valor: '06',
                ValorInt: 6
            },
            {
                Nombre: 'Julio',
                Valor: '07',
                ValorInt: 7
            },
            {
                Nombre: 'Agosto',
                Valor: '08',
                ValorInt: 8
            },
            {
                Nombre: 'Septiembre',
                Valor: '09',
                ValorInt: 9
            },
            {
                Nombre: 'Octubre',
                Valor: '10',
                ValorInt: 10
            },
            {
                Nombre: 'Noviembre',
                Valor: '11',
                ValorInt: 11
            },
            {
                Nombre: 'Diciembre',
                Valor: '12',
                ValorInt: 12
            },

        ];
        return arrMeses;
    }
    retornaDiasDelMesStr(mes){
        var arreglo = [];
        switch (mes){
            case '02':
                for(var s=1; s<=28; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
            }
            break;
            case '04':
            case '06':
            case '09':
            case '11':
                for(var s=1; s<=30; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
                }
                break; 
            case '01':
            case '03':
            case '05':
            case '07':
            case '08':
            case '09':
            case '12':
                for(var s=1; s<=30; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
                }
                break;                                    
        }

        return arreglo;
    }
    retornaDiasDelMes(mes){
        var arreglo = [];
        switch (mes){
            case 'Febrero':
                for(var s=1; s<=28; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
            }
            break;
            case 'Abril':
            case 'Junio':
            case 'Septiembre':
            case 'Noviembre':
                for(var s=1; s<=30; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
                }
                break; 
            case 'Enero':
            case 'Marzo':
            case 'Mayo':
            case 'Julio':
            case 'Agosto':
            case 'Septiembre':
            case 'Diciembre':
                for(var s=1; s<=30; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
                }
                break;                                    
        }

        return arreglo;
    }
    retornaDiasDelMesInt(mes){
        var arreglo = [];
        switch (mes){
            case 2:
                for(var s=1; s<=28; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
            }
            break;
            case 4:
            case 6:
            case 9:
            case 11:
                for(var s=1; s<=30; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
                }
                break; 
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 9:
            case 12:
                for(var s=1; s<=30; s++){
                    var dia = '';
                    if (s<10){
                        dia = '0' + s.toString();
                    }
                    else {
                        dia = s.toString();
                    }
                    var entidadMes = {
                        Dia: dia
                    }
                    arreglo.push(entidadMes);
                }
                break;                                    
        }

        return arreglo;
    }
    procesarRespuestaMapa(objeto){
       var retorno = false;
        try {
            if (objeto.results && objeto.results[0]) {
                if (objeto.results[0].address_components && objeto.results[0].address_components.length > 0) {
                    //ahora recorremos los elementos
                    objeto.results[0].address_components.forEach(element => {
                        let busquedaCom = element.types.find(ele => ele == 'administrative_area_level_3');
                        if (busquedaCom) {
                            this.comuna = element.long_name;
                            sessionStorage.setItem('comuna', this.comuna);
                        }
                        let busquedaReg = element.types.find(ele => ele == 'administrative_area_level_1');
                        if (busquedaReg) {
                            this.region = element.long_name;
                            sessionStorage.setItem('region', this.region);
                        }
                        let busquedaProv = element.types.find(ele => ele == 'administrative_area_level_2');
                        if (busquedaProv) {
                            this.provincia = element.long_name;
                            sessionStorage.setItem('provincia', this.provincia);
                        }
                        let busquedaPais = element.types.find(ele => ele == 'country');
                        if (busquedaPais) {
                            this.pais = element.long_name;
                            sessionStorage.setItem('pais', this.pais);
                        }
                    });
                }
            }
            retorno = true;
        }
        catch (error) {
            console.log(error);
            
        }
        return retorno;

       //console.log(this.pais + ' ' + this.region);
    }
    emailIsValid(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }
    phoneIsValid(phone){
        return /^(\+?56)?(\s?)(0?9)(\s?)[9876543]\d{7}$/.test(phone);
    }
    async presentToast(mensaje, posicion, duracion){
        const toas = await this.toast.create(
          {
            message: mensaje,
            position: posicion,
            duration: duracion
          }
        );
        toas.present();
       }

}
