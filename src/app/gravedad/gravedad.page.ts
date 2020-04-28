import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-gravedad',
  templateUrl: './gravedad.page.html',
  styleUrls: ['./gravedad.page.scss'],
})
export class GravedadPage implements OnInit {

  title: any;
  categoria: any;
  categoriaSeleccionada: any;
  transporte: any;
  gravedad: any;
  esPublico: boolean = true;

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
  ) { 
    //this.categoriaSeleccionada = localStorage.getItem("categoria");
    this.categoriaSeleccionada = sessionStorage.getItem("categoria");
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
    console.log(this.categorizacion);
  }
  onChangePublico(event){
    
    if (event.detail){
      this.esPublico = event.detail.checked;
      sessionStorage.setItem('ES_PUBLICO', JSON.stringify(this.esPublico));
    }
    console.log(this.esPublico);
  }

  ngOnInit() {
  }

	verMapa() {
/* 		localStorage.setItem("transporte", this.transporte);
    localStorage.setItem("gravedad", this.gravedad); */
    sessionStorage.setItem("transporte", this.transporte);
		sessionStorage.setItem("gravedad", this.gravedad);

    /* if (localStorage.getItem("conexion") == 'offline' || localStorage.getItem("latitud") == null) { */
    if (localStorage.getItem("conexion") == 'offline' || sessionStorage.getItem("latitud") == null) {
			this.navCtrl.navigateForward('error');
		} else {
			this.navCtrl.navigateForward('mapa-test');
		}
	}

}
