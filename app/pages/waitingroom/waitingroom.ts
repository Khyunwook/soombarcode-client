import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Roomservice } from '../../providers/roomservice/roomservice';
import { Socket } from '../../providers/socket/socket';
import { GameplayPage } from '../gameplay/gameplay';
/*
  Generated class for the WaitingroomPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/waitingroom/waitingroom.html',
})
export class WaitingroomPage {

  roominfo : any;
  Ateam =[];
  Bteam =[];
  zone : any;
  socket : any;
  isMaster: boolean;

  constructor(private nav: NavController, public navParams: NavParams, public SocketService : Socket , public ngzone : NgZone) {

    this.zone = ngzone;
    this.roominfo = this.navParams.get('roominfo');
    if(this.roominfo.master === this.roominfo.join_user_id){
      this.isMaster = true;
    }else{
      this.isMaster = false;
    }
    console.log("isMaster",this.isMaster);
    this.getsocket();
    this.SocketSendRoom();

  }

  getsocket(){
    this.socket = this.SocketService.getSocket();
  }

  SocketSendRoom(){
    let zone = this.zone;
    console.log('teamlength',this.Ateam);
    console.log('wait-roominfo',this.roominfo);
    this.socket.emit('joinroom', {room : this.roominfo});

    this.socket.on('userlist',(data)=>{
      console.log('rec',data.userskey);
      zone.run(()=>{

        for(let i = 0; i<data.userskey.length; i++){
          if(this.Ateam.indexOf(data.users[data.userskey[i]])=== -1 )
          this.Ateam.push(data.users[data.userskey[i]]);
        }
      });
      //this.Ateam = data.users );
      console.log("Ateam",this.Ateam);
    });
  }

  changeTeam(){
    var findindex = this.Ateam.indexOf(this.roominfo.join_user_name);
    if(findindex===-1){
      console.log("Ateam null");
      var findindex = this.Bteam.indexOf(this.roominfo.join_user_name);
      this.Ateam.push(this.Bteam[this.Bteam.indexOf(this.roominfo.join_user_name)]);
      this.Bteam.splice(findindex,findindex+1);
    }else{
      console.log("Bteam null");
      this.Bteam.push(this.Ateam[this.Ateam.indexOf(this.roominfo.join_user_name)]);
      this.Ateam.splice(findindex,findindex+1);
    }
  }
  playgame(){
    this.nav.push( GameplayPage );
    this.nav.pop(WaitingroomPage);
  }


}
