import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Roomservice } from '../../providers/roomservice/roomservice';
import { Socket } from '../../providers/socket/socket';
import { GameplayPage } from '../gameplay/gameplay';
import { RoomPage } from '../room/room';
import { TabsPage } from '../tabs/tabs';
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
  currentUser_id : any;
  currentTeam : string;

  constructor(private nav: NavController, public navParams: NavParams, public SocketService : Socket , public ngzone : NgZone, public viewCtrl: ViewController) {

    this.zone = ngzone;
    this.roominfo = this.navParams.get('roominfo');
    console.log('roominfo',this.roominfo);
    if(this.roominfo.master_id === this.roominfo.join_user_id){
      this.isMaster = true;
    }else{
      this.isMaster = false;
    }
    this.currentUser_id = this.roominfo.join_user_id;

    this.getsocket();
    this.SocketJoinRoom();
    this.waitgame();
  }

  getsocket(){
    this.socket = this.SocketService.getSocket();
  }

  SocketJoinRoom(){
    this.socket.emit('joinroom', {room : this.roominfo});

    this.socket.on('userlist',(data)=>{
      this.roomlistupdate(data);
    });
  }

  roomlistupdate( userlist ){
    let zone = this.zone;
      console.log('userlistupdata',userlist.users);

      zone.run(()=>{

        this.Ateam.splice(0,this.Ateam.length);
        this.Bteam.splice(0,this.Bteam.length);
        for(let i =0; i<userlist.users.length; i++){
          console.log('foruserlist',userlist.users[i]);
          if(userlist.users[i].juser_id===this.currentUser_id){
            this.currentTeam = userlist.users[i].team;
          }
          if(userlist.users[i].team==='A'){
            this.Ateam.push(userlist.users[i]);
          }else{
            this.Bteam.push(userlist.users[i]);
          }
        }
      });
  }

  SocketUpdateRoom(join_user_id, team){
    console.log('updateRoom',join_user_id)
    this.socket.emit('joinroomupdate',{ room : this.roominfo, juser : { join_user_id : join_user_id, join_user_team : team }});
  }

  changeTeam(team){

    console.log('currt_team,team',this.currentTeam,team);
    if(this.currentTeam !== team){
      this.SocketUpdateRoom(this.currentUser_id,team);
    }
  }

  goback(){
    //this.nav.push( TabsPage );
    //this.nav.pop();

    this.socket.emit('outroomupdate',{ room : this.roominfo, user_id : this.currentUser_id } );
    this.viewCtrl.dismiss();
  }

  playgame(){

    this.socket.emit('startgame',{ room : this.roominfo, Ateam : this.Ateam, Bteam : this.Bteam });

  //  this.nav.push( GameplayPage );
  //  this.nav.pop();//WaitingroomPage
  }
  waitgame(){
    this.socket.on('playgame',(data)=>{
      console.log('playgame',data);
      this.nav.push( GameplayPage, {room_id : data.room_id, users : data.users} );
      //this.nav.pop();
    });
  }


}
