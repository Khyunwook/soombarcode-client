import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { Socket } from '../../providers/socket/socket';

/*
  Generated class for the GameplayPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/gameplay/gameplay.html',
})
export class GameplayPage {
  room_id : any;
  users : any;
  Ateam =[];
  Bteam =[];
  conv_barcode : any;

  constructor(private nav: NavController,  public navParams: NavParams) {
    this.room_id = this.navParams.get('room_id');
    this.users = this.navParams.get('users');
    for(let i=0; i<this.users.length; i++){
      if(this.users[i].team==='A'){
        this.Ateam.push(this.users[i]);
      }else{
        this.Bteam.push(this.users[i]);
      }
    }
  }
  playbarcode(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.conv_barcode = barcodeData.text;
      alert("we got a barcode"+ this.conv_barcode);
            });

            /*
            alert("We got a barcode\n" +
                      "Result: " + barcodeData.text + "\n" +
                      "Format: " + barcodeData.format + "\n" +
                      "Cancelled: " + barcodeData.cancelled);
                    }, (err) => {
                      alert("Scanning failed: " + err);
                    });
                    */
  }

  //changeNumber : 게임을 시작할 때 바코드 정보 처리를 위해 생성한 랜덤한 숫자(각 게임마다 랜덤한 값을 가진다)
  barcodeToItem(barcode, changeNumber){
    changeNumber = this.generateRandom(100, 100000);
    return (barcode % changeNumber) % 100;
  }

  //랜덤 생성 함수
  generateRandom(min, max) {
     return Math.floor(Math.random()*max) + min;
  }

  //changeNumber 생성구문

}
