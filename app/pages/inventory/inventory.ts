import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the InventoryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/inventory/inventory.html',
})
export class InventoryPage {

  BedgeArr : any;

  constructor(private nav: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.BedgeArr = this.navParams.get('Bedgearr')
  }
  dismiss() {
    this.viewCtrl.dismiss();
    //this.nav.pop();
  }
}
