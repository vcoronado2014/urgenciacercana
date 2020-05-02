import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  /* { path: '', redirectTo: 'home', pathMatch: 'full' }, */
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'modal-vista',
    loadChildren: () => import('./modal-vista/modal-vista.module').then( m => m.ModalVistaPageModule)
  },
  {
    path: 'error',
    loadChildren: () => import('./error/error.module').then( m => m.ErrorPageModule)
  },
  {
    path: 'mapa-test',
    loadChildren: () => import('./mapa-test/mapa-test.module').then( m => m.MapaTestPageModule)
  },
  {
    path: 'gravedad',
    loadChildren: () => import('./gravedad/gravedad.module').then( m => m.GravedadPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'busqueda',
    loadChildren: () => import('./busqueda/busqueda.module').then( m => m.BusquedaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
