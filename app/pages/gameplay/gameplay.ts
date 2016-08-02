import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

/*
  Generated class for the GameplayPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/gameplay/gameplay.html',
})
export class GameplayPage {

  constructor(private nav: NavController) {

  }
  playbarcode(){
    BarcodeScanner.scan().then((barcodeData) => {
      alert("We got a barcode\n" +
                "Result: " + barcodeData.text + "\n" +
                "Format: " + barcodeData.format + "\n" +
                "Cancelled: " + barcodeData.cancelled);
              }, (err) => {
                alert("Scanning failed: " + err);
              });
  }
}
