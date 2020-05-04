import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  categoria: any;
  icon: any;
  constructor(
    public popover: PopoverController,
    public nav: NavParams
  ) { }

  ngOnInit() {
    //capturamos los datos
    this.categoria = this.nav.data.categoria;
    this.icon = this.nav.data.icon;
    //console.log(this.categoria);
  }

  cerrar(){
    this.popover.dismiss();
  }

}
