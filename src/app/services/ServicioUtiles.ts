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
    //validaciones de run
    private revisarDigito(dvr) {
        var dv = dvr + ""
        if (dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k' && dv != 'K') {
            this.presentToast("Debe ingresar un digito verificador valido", "bottom", 5000);
            return false;
        }
        return true;
    }

    private revisarDigito2(crut) {
        var rut;
        var dv = '';
        var dvi;
        var largo = crut.length;
        if (largo < 2) {
            this.presentToast("Debe ingresar el run completo", "bottom", 5000)
            return false;
        }
        if (largo > 2)
            rut = crut.substring(0, largo - 1);
        else
            rut = crut.charAt(0);
        dv = crut.charAt(largo - 1);
        this.revisarDigito(dv);

        if (rut == null || dv == null)
            return 0

        var dvr = '0'
        var suma = 0
        var mul = 2

        for (var i = rut.length - 1; i >= 0; i--) {
            suma = suma + rut.charAt(i) * mul
            if (mul == 7)
                mul = 2
            else
                mul++
        }
        var res = suma % 11
        if (res == 1)
            dvr = 'k'
        else if (res == 0)
            dvr = '0'
        else {
            dvi = 11 - res
            dvr = dvi + ""
        }
        if (dvr != dv.toLowerCase()) {
            this.presentToast("EL run es incorrecto", "bottom", 5000)
            return false
        }

        return true
    }

    Rut(texto) {
        var largo;
        var tmpstr = "";
        for (var i = 0; i < texto.length; i++)
            if (texto.charAt(i) != ' ' && texto.charAt(i) != '.' && texto.charAt(i) != '-')
                tmpstr = tmpstr + texto.charAt(i);
        texto = tmpstr;
        largo = texto.length;

        if (largo < 2) {
            this.presentToast("Debe ingresar el run completo", "bottom", 5000)
            return false;
        }

        for (var i = 0; i < largo; i++) {
            if (texto.charAt(i) != "0" && texto.charAt(i) != "1" && texto.charAt(i) != "2" && texto.charAt(i) != "3" && texto.charAt(i) != "4" && texto.charAt(i) != "5" && texto.charAt(i) != "6" && texto.charAt(i) != "7" && texto.charAt(i) != "8" && texto.charAt(i) != "9" && texto.charAt(i) != "k" && texto.charAt(i) != "K") {
                this.presentToast("El valor ingresado no corresponde a un R.U.N valido", "bottom", 5000);
                return false;
            }
        }

        var invertido = "";
        for (i = (largo - 1), j = 0; i >= 0; i--, j++)
            invertido = invertido + texto.charAt(i);
        var dtexto = "";
        dtexto = dtexto + invertido.charAt(0);
        dtexto = dtexto + '-';
        var cnt = 0;

        for (var i = 1, j = 2; i < largo; i++, j++) {
            if (cnt == 3) {
                dtexto = dtexto + '.';
                j++;
                dtexto = dtexto + invertido.charAt(i);
                cnt = 1;
            }
            else {
                dtexto = dtexto + invertido.charAt(i);
                cnt++;
            }
        }

        invertido = "";
        for (i = (dtexto.length - 1), j = 0; i >= 0; i--, j++)
            invertido = invertido + dtexto.charAt(i);

        //hay que ver que hace esto
        //window.document.form1.rut.value = invertido.toUpperCase()		

        if (this.revisarDigito2(texto))
            return true;

        return false;
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
            case '10':
            case '12':
                for(var s=1; s<=31; s++){
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
            case 'Octubre':
            case 'Diciembre':
                for(var s=1; s<=31; s++){
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
                //averiguar si es biciesto 28-29 días
                //lo dejamos en 28 mejor
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
            case 10:
            case 12:
                for(var s=1; s<=31; s++){
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
