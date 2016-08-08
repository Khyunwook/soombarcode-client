import { Component } from '@angular/core';
import { Alert, NavController, NavParams, Modal } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { InventoryPage } from '../inventory/inventory';
import { Socket } from '../../providers/socket/socket';
import { Gameservice } from '../../providers/gameservice/gameservice';

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

  constructor(private nav: NavController,  public navParams: NavParams, public GameService : Gameservice) {
    this.room_id = this.navParams.get('room_id');
    this.users = this.navParams.get('users');
    console.log("gameplay",this.users);
    for(let i=0; i<this.users.length; i++){
      if(this.users[i].team==='A'){
        this.Ateam.push(this.users[i]);
      }else{
        this.Bteam.push(this.users[i]);
      }
    }

    //모드에 따라..어디서 저장하지..?
    //this.GameService.itemsetting();
  }
  openInventory(){
    let modal = Modal.create(InventoryPage);
    this.nav.present(modal);
  }

  playbarcode(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.conv_barcode = this.barcodeToItem(barcodeData.text);
      alert("we got a barcode"+ this.conv_barcode);
    });
  }
  tempbarcode(){
    var tbarcode;
    let prompt = Alert.create({
      title: '임시 바코드 기능',
      message: "바코드 번호 입력",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.conv_barcode = this.barcodeToItem(data.title);
            alert("we got a barcode"+ this.conv_barcode);
          }
        }
      ]
    });

    this.nav.present(prompt);
  }

  //changeNumber : 게임을 시작할 때 바코드 정보 처리를 위해 생성한 랜덤한 숫자(각 게임마다 랜덤한 값을 가진다)
  barcodeToItem(barcode){
    var changeNumber = this.generateRandom(100, 100000);
    return (barcode % changeNumber) % 100;
  }

  //랜덤 생성 함수
  generateRandom(min, max) {
     return Math.floor(Math.random()*max) + min;
  }

  //changeNumber 생성구문

}
