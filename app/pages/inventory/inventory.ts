import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

/*
  Generated class for the InventoryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/inventory/inventory.html',
})
export class InventoryPage {

  constructor(private nav: NavController, public viewCtrl: ViewController) {

  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
