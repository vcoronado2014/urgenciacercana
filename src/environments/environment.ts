// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_ENDPOINT: 'https://app.rayensalud.com/MiFamilia/Api/',
  API_RAIZ: 'https://app.rayensalud.com/MiFamilia',
  //API_ENDPOINT: 'http://190.151.14.101:8065/Api/',
  //API_RAIZ: 'http://190.151.14.101:8065',
  viewZoomControl: false,
  viewMapTypeControl: false,
  viewfullscreenControl: false,
  viewstreetViewControl: false,
  //logo e info de la poropaganda
  imgPropaganda: "./assets/imgs/banner_pequeno_rayen.png",
  tituloPropaganda: "Información proporcionada por Rayen Salud",
  subTituloPropaganda: "Email: contacto@rayensalud.com",
  /* API_KEY_MAPA: 'AIzaSyArou1B6ZXJexDEYfI98MDHoq-eSKdhscU', */
  API_KEY_MAPA: 'AIzaSyAqx2BInVZJP-xhUh5oSUgKSPh3rpB_Rzc',
  ProcesaHorario: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
