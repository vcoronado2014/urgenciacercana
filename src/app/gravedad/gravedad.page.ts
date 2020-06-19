import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ServicioGeo } from '../../app/services/ServicioGeo';
import { ServicioUtiles } from '../../app/services/ServicioUtiles';
import { environment } from '../../environments/environment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
//modal
import { DetallePropagandaPage } from '../detalle-propaganda/detalle-propaganda.page';

@Component({
  selector: 'app-gravedad',
  templateUrl: './gravedad.page.html',
  styleUrls: ['./gravedad.page.scss'],
})
export class GravedadPage implements OnInit {

  //pruebas de slides
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  };

  title: any;
  categoria: any;
  categoriaSeleccionada: any;
  transporte: any;
  gravedad: any;
  esPublico: boolean = true;
  propaganda = {
    Nombre: '',
    Titulo: '',
    Subtitulo: '',
    RutaImagen: '',
    Telefonos:'',
    CorreoElectronico: '',
    PaginaWeb: '',

  }
  //ESTO CAMBIO, YA QUE AHORA ES UN ARREGLO DE PROPAGANDA
  propagandas: any;
  //*************************************************** */
  lati = sessionStorage.getItem("latitud");
  latConComa = this.lati.replace(/\./gi, ",");

  /* longi = localStorage.getItem("longitud"); */
  longi = sessionStorage.getItem("longitud");
  longiConComa = this.longi.replace(/\./gi, ",");

  categorizacion: any = {
    tipo: null,
    gravedad: null
  }

  gravedadNino: any = {
    c1: {
      img: "./assets/imgs/nino1.png",
      tipoGravedad: "Gravedad extrema",
      /*ejemplo: ["Paro cardiorespiratorio", "Gran quemadura", "Hemorragia o sangrado masivo", "Convulsiones"]*/
      ejemplo: "Paro cardiorespiratorio. Gran quemadura. Hemorragia o sangrado masivo. Convulsiones."
    },
    c2: {
      img: "./assets/imgs/nino2.png",
      tipoGravedad: "Gravedad severa",
      ejemplo: "Daños que puedan provocar secuelas. Diabético descompensado. Pérdida de conciencia. Fractura de cráneo. Crisis convulsiva. Trauma ocular. Descompensación de enfermedades crónicas."
    },
    c3: {
      img: "./assets/imgs/nino3.png",
      tipoGravedad: "Gravedad mediana",
      ejemplo: "Heridas con hemorragia activa. Quemaduras sin riesgo vital. Fracturas."
    },
    c4: {
      img: "./assets/imgs/nino4.png",
      tipoGravedad: "Gravedad leve",
      ejemplo: "Dolor abdominal. Contusiones menores. Diarrea. Fiebre. Cuadros respiratorios simples. Reacciones alérgicas. Cuadros gastrointestinales. Torsión de tobillo."
    },
    c5: {
      img: "./assets/imgs/nino5.png",
      tipoGravedad: "Gravedad no pertinente",
      ejemplo: "Resfrío común. Dolor de espalda. Infección urinaria. Oídos tapados. Curaciones."
    }
  }
  gravedadEmbarazada: any = {
    c1: {
      img: "./assets/imgs/embarazada1.png",
      tipoGravedad: "Atención inmediata",
      ejemplo: "Parto. Infarto. Paro cardiorespiratorio. Gran quemadura. Hemorragia o sangrado masivo. Convulsiones."
    },
    c2: {
      img: "./assets/imgs/embarazada2.png",
      tipoGravedad: "Gravedad severa",
      ejemplo: "Hemorragias de embarazo. Daños que puedan provocar secuelas. Diabético descompensado. Pérdida de conciencia. Fractura de cráneo. Crisis convulsiva. Dolor torácico opresivo. Arritmia. Trauma ocular. Descompensación de enfermedades crónicas"
    },
    c3: {
      img: "./assets/imgs/embarazada3.png",
      tipoGravedad: "Gravedad mediana",
      ejemplo: "Heridas con hemorragia activa. Quemaduras sin riesgo vital. Fracturas. Crisis hipertensiva. Fractura de cadera o extremidades."
    },
    c4: {
      img: "./assets/imgs/embarazada4.png",
      tipoGravedad: "Gravedad leve",
      ejemplo: "Dolor abdominal. Contusiones menores. Diarrea. Fiebre. Cuadros respiratorios simples. Reacciones alérgicas. Cuadros gastrointestinales. Torsión de tobillo. Lumbalgia."
    },
    c5: {
      img: "./assets/imgs/embarazada5.png",
      tipoGravedad: "Gravedad no pertinente",
      ejemplo: "Resfrío común. Dolor de espalda. Infección urinaria. Oídos tapados. Curaciones."
    }
  }
  gravedadAdulto: any = {
    c1: {
      img: "./assets/imgs/adulto1.png",
      tipoGravedad: "Gravedad extrema",
      ejemplo: "Paro cardiorespiratorio. Infarto. Gran quemadura. Hemorragia o sangrado masivo. Convulsiones. Dificultad respiratoria severa. Taquicardia."
    },
    c2: {
      img: "./assets/imgs/adulto2.png",
      tipoGravedad: "Gravedad severa",
      ejemplo: "Daños que puedan provocar secuelas. Diabético descompensado. Pérdida de conciencia. Fractura de cráneo. Crisis convulsiva. Dolor torácico opresivo. Arritmia. Trauma ocular. Descompensación de enfermedades crónicas"
    },
    c3: {
      img: "./assets/imgs/adulto3.png",
      tipoGravedad: "Gravedad mediana",
      ejemplo: "Heridas con hemorragia activa. Quemaduras sin riesgo vital. Crisis hipertensiva. Fractura de cadera o extremidades."
    },
    c4: {
      img: "./assets/imgs/adulto4.png",
      tipoGravedad: "Gravedad leve",
      ejemplo: "Dolor abdominal. Contusiones menores. Diarrea. Fiebre. Cuadros respiratorios simples. Reacciones alérgicas. Cuadros gastrointestinales. Torsión de tobillo. Lumbalgia"
    },
    c5: {
      img: "./assets/imgs/adulto5.png",
      tipoGravedad: "Gravedad no pertinente",
      ejemplo: "Resfrío común. Dolor de espalda. Infección urinaria. Oídos tapados. Curaciones. Amigdalitis. Picadura de insecto."
    }
  }

  constructor(
    public navCtrl: NavController,
    public geo: ServicioGeo,
    public utiles: ServicioUtiles,
    public modalCtrl: ModalController,
    public inap: InAppBrowser,
  ) { 
    this.categoriaSeleccionada = sessionStorage.getItem("categoria");
    //verificamos transporte
    if (sessionStorage.getItem("transporte")){
      this.transporte = sessionStorage.getItem("transporte");
    }
    else{
      this.transporte = 'DRIVING';
    }
    //guardamos la variable de publico
    if (sessionStorage.getItem('ES_PUBLICO')){
      this.esPublico = JSON.parse(sessionStorage.getItem('ES_PUBLICO'));
    }
    else{
      sessionStorage.setItem('ES_PUBLICO', JSON.stringify(this.esPublico));
    }

    switch (this.categoriaSeleccionada) {
      case 'nino':
        this.title = "Niños";
        this.categoria = "nino";
        this.categorizacion.gravedad = this.gravedadNino;
        break;
      case 'embarazada':
        this.title = "Embarazadas";
        this.categoria = "embarazada";
        this.categorizacion.gravedad = this.gravedadEmbarazada;
        break;
      case 'adulto':
        this.title = "Adultos";
        this.categoria = "adulto";
        this.categorizacion.gravedad = this.gravedadAdulto;
        break;
    }
    this.categorizacion.tipo = this.categoria;
  }
  onChangePublico(event){
    
    if (event.detail){
      this.esPublico = event.detail.checked;
      sessionStorage.setItem('ES_PUBLICO', JSON.stringify(this.esPublico));
    }
  }
  setearPropagandaArr(arrPropaganda, esData){
    
    if (arrPropaganda && arrPropaganda.length > 0){
      arrPropaganda.forEach(propa => {
        if (esData){
          propa.RutaImagen = environment.API_RAIZ + propa.RutaImagen;
          propa.RutaImagenDetalle = environment.API_RAIZ + propa.RutaImagenDetalle;
        }
      });
    }
    sessionStorage.setItem('PROPAGANDA', JSON.stringify(arrPropaganda));
  
}
  ngOnInit() {
    this.propagandas = [];
    var publico = 0;
    if (this.esPublico) {
      publico = 1;
    }
    if (!this.utiles.isAppOnDevice()) {
      //web
      this.geo.postPropaganda(this.latConComa, this.longiConComa, publico).subscribe((data: any) => {
        if (data) {
          //setear
          this.propagandas = data;
          this.setearPropagandaArr(data, true);
        }
        else {
          //defecto
          var objPropaganda = {
            Nombre: environment.tituloPropaganda,
            Titulo: environment.tituloPropaganda,
            Subtitulo: environment.subTituloPropaganda,
            RutaImagen: environment.imgPropaganda,
            Telefonos: '',
            CorreoElectronico: '',
            PaginaWeb: '',
          }
          this.propagandas.push(objPropaganda);
          this.setearPropagandaArr(this.propagandas, false);
        }
      })
    }
    else {
      //dispositivo
      this.geo.postPropagandaNative(this.latConComa, this.longiConComa, publico).then((response: any) => {
        //JSON.parse(response.data)
        var data = JSON.parse(response.data);
        if (data) {
          //setear
          this.propagandas = data;
          this.setearPropagandaArr(data, true);
        }
        else {
          //defecto
          var objPropaganda = {
            Nombre: environment.tituloPropaganda,
            Titulo: environment.tituloPropaganda,
            Subtitulo: environment.subTituloPropaganda,
            RutaImagen: environment.imgPropaganda,
            Telefonos: '',
            CorreoElectronico: '',
            PaginaWeb: '',
          }
          this.propagandas.push(objPropaganda);
          this.setearPropagandaArr(this.propagandas, false);
        }

      })
    }
  }

	verMapa() {
    sessionStorage.setItem("transporte", this.transporte);
		sessionStorage.setItem("gravedad", this.gravedad);
    if (localStorage.getItem("conexion") == 'offline' || sessionStorage.getItem("latitud") == null) {
			this.navCtrl.navigateForward('error');
		} else {
			this.navCtrl.navigateForward('mapa-test');
		}
  }

  async clickPropagandaInferior(item) {
    console.log(item);
    const modal = await this.modalCtrl.create(
      {
        component: DetallePropagandaPage,
        componentProps: {
          'propaganda': item
        }
      }
    );
    return await modal.present();
  }

}
