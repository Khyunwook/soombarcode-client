import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RoomPage } from '../room/room';
import { Data } from '../../providers/data/data';
import { Roomservice } from '../../providers/roomservice/roomservice';
import { WaitingroomPage } from '../waitingroom/waitingroom';
/*
  Generated class for the MakeroomPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/makeroom/makeroom.html',
})
export class MakeroomPage {

  roomname : string;
  roompass : string;
  gaming : string;
  masterUser : any;

  constructor(private nav: NavController, public dataService : Data , public RoomService: Roomservice) {
    this.masterUser;
    this.dataService.getUser().then(res=>{
       let currentUser = JSON.parse(res);
       this.masterUser = currentUser;
    });


  }
  makeroom() {
    console.log('master',this.masterUser);
    let roomobj = {
      roomname : this.roomname,
      password : this.roompass,
      nton : this.gaming,
      master : this.masterUser.userid,
      name : this.masterUser.username
    }

    this.RoomService.makeroom(roomobj).then( res=>{
      console.log(res);
      if(res){
        this.nav.push(WaitingroomPage, {roominfo : res});
        this.nav.pop(MakeroomPage);
      }
    });

  }

}
