import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Modal, Alert } from 'ionic-angular';
import { Roomservice } from '../../providers/roomservice/roomservice';
import { Gameservice } from '../../providers/gameservice/gameservice';
import { Socket } from '../../providers/socket/socket';
import { GameplayPage } from '../gameplay/gameplay';
import { WriteProfilePage } from '../write-profile/write-profile';
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
  wusers =[];
  zone : any;
  socket : any;
  isMaster: boolean;
  is_fill_form: boolean;
  currentUser_id : any;
  currentTeam : string;
  is_game : boolean;
  current_Ready : boolean;
  ready_count : any;
  roomname : any;

  constructor(private nav: NavController, public navParams: NavParams, public SocketService : Socket , public ngzone : NgZone, public viewCtrl: ViewController, public GameService :Gameservice) {
    this.ready_count = 0;
    this.is_fill_form = false;
    this.current_Ready = false;
    this.is_game = false;
    this.zone = ngzone;
    this.roominfo = this.navParams.get('roominfo');
    this.roomname = this.navParams.get('roomname');
    console.log('roominfo',this.roominfo);
    if(this.roominfo.master_id === this.roominfo.join_user_id){
      this.isMaster = true;
    }else{
      this.isMaster = false;
    }
    this.currentUser_id = this.roominfo.join_user_id;

    this.SocketService.connectSocket();
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
    this.ready_count = 0;
      console.log('userlistupdata',userlist.users);
      for(let i = 0; i<userlist.users.length; i++){
        if(userlist.users[i].ready){
          this.ready_count++;
        }
      }
      zone.run(()=>{
        //this.wusers.splice(0,this.wusers.length);
        this.wusers = userlist.users;
      });
  }

  SocketUpdateRoom(join_user_id, ready){
    console.log('updateRoom',join_user_id)
    this.socket.emit('joinroomupdate',{ room : this.roominfo, juser : { join_user_id : join_user_id, join_user_ready : ready }});
  }

  goback(){
    this.socket.emit('outroomupdate',{ room : this.roominfo, user_id : this.currentUser_id } );
    this.socket.disconnect();
    this.viewCtrl.dismiss();
  }


  input_profile(){
    let zone = this.zone;
    let modal = Modal.create(WriteProfilePage);
    modal.onDismiss(data => {
      console.log('data',data);
    /*  zone.run(()=>{
        this.is_fill_form=data;
      });*/
      this.is_fill_form=data;
   });
    this.nav.present(modal);
  }
  onReady(){
      if(this.current_Ready===false){
        this.current_Ready=true;
      }else{
        this.current_Ready=false;
      }
      this.SocketUpdateRoom(this.currentUser_id ,this.current_Ready);
  }

  playgame(){

    if(this.ready_count+1 === this.wusers.length){
    //  this.GameService.makeDanseo({room_id : this.roominfo.room_id}).then( res =>{
      //  if(res){
          this.socket.emit('startgame',{ room : this.roominfo, wusers : this.wusers });
        //}
      //});
    }else{
      let prompt = Alert.create({
        title: 'Can not start',
        subTitle: '플래이어가 모두 READY상태가 아닙니다!',
        buttons: ['OK']
      });
      this.nav.present(prompt);
    }

  console.log('test',this.roominfo);
  /*
    this.GameService.makeDanseo({room_id : this.roominfo.room_id}).then( res =>{
      if(res){
        this.socket.emit('startgame',{ room : this.roominfo, wusers : this.wusers });
      }
    });
    this.socket.emit('startgame',{ room : this.roominfo, wusers : this.wusers });
    */
  }
  waitgame(){

    this.socket.on('playgame',(data)=>{
      console.log('playgame',data);
      if(!this.is_game){
        this.is_game=true;
        this.nav.setRoot( GameplayPage, {room_id : data.room_id, users : data.users, iam : this.roominfo.join_user_id ,cusers : null} );
      }//this.nav.pop();
    });
  }


}
