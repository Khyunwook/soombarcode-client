import { Component } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import { MakeroomPage } from '../makeroom/makeroom';
import { WaitingroomPage } from '../waitingroom/waitingroom';
import { Data } from '../../providers/data/data';
import { Roomservice } from '../../providers/roomservice/roomservice';
import { TabsPage } from '../tabs/tabs';
/*
  Generated class for the RoomPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/room/room.html',
})
export class RoomPage {

  rooms : any;
  join_user : any;

  constructor(private nav: NavController, public dataService: Data, public RoomService : Roomservice) {
    dataService.getUser().then(res=>{
        if(res){
          this.join_user =JSON.parse(res);
          console.log('join_user',this.join_user);
        }
    });

    this.refreshroom();
  }

  refreshroom(){
    this.RoomService.updateroomlist().then(()=>{
      this.dataService.getRooms().then(res=>{
        if(res){
          console.log("room.res",res);
          this.rooms=JSON.parse(res);
        }
      });
    });
  }

  makeroom(): void {
    this.nav.push( MakeroomPage );
  }

  inRoomlist(room){
    console.log("joinroom",room)

    var roomObj ={
      room_id : room._id,
      join_user_id : this.join_user.userid,
      join_user_name : this.join_user.username,
      limit : room.nton,
      master_id : room.master_id
    }
    this.nav.push(WaitingroomPage,{roominfo : roomObj});
  }
}
