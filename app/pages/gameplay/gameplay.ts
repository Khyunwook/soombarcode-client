import { Component, NgZone, Input, OnInit, OnDestroy } from '@angular/core';
import { Alert, NavController, NavParams, Modal, Toast } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { InventoryPage } from '../inventory/inventory';
import { Socket } from '../../providers/socket/socket';
import { Gameservice } from '../../providers/gameservice/gameservice';
import { Data } from '../../providers/data/data';
import { CountdownTimer } from './countdownTimer.ts';
import { TabsPage } from '../tabs/tabs';
import { UserprofilePage } from '../userprofile/userprofile';
import { GameresultPage } from '../gameresult/gameresult';
/*
  Generated class for the GameplayPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/gameplay/gameplay.html',
})
export class GameplayPage {
  zone : any;
  room_id : any;
  my_id : any;
  AUsers =[];
  MUsers =[];
  BedgeArr = [];
  shuffleProfile =[];

  socket : any;
  item_barcode : any;
  clue_barcode : any;
  item_making_value = 12417;
  item_value = 7; //아이템 범위
  clue_making_value = 13547;
  clue_value = 307; //단서 범위
  is_clue : boolean;
  is_live : boolean;
  is_makecurios : boolean;
  is_fullitem : boolean;
  clue_n : number;
  live_n : number;
  clue_flag : boolean;

  user_lever : any;
  barcode_count : any;
  timeInSeconds: number;
  private timer: CountdownTimer;



  constructor(private nav: NavController,  public navParams: NavParams, public GameService : Gameservice, public ngzone : NgZone, public dataService : Data, public SocketService : Socket  )
  {
    this.zone = ngzone;
    this.clue_flag=false;
    this.is_makecurios = false;
    this.BedgeArr = new Array(false, false, false, false, false, false, false);
    this.live_n=0;
    this.clue_n=0;
    this.is_live = true;
    this.barcode_count=0;
    this.room_id = this.navParams.get('room_id');
    this.AUsers = this.navParams.get('users');
    this.my_id = this.navParams.get('iam');
    console.log("gameplay",this.AUsers);
    this.timeInSeconds = 180;
    this.is_fullitem = false;

    this.initTimer();
    this.startTimer();
    this.getsocket();
    this.makeCurios();
    this.makeArr();
    this.killAfter();
    this.saveProfile();

    if(this.is_clue){
      var myprofile;
      this.dataService.getProfile().then(res=>{
        if(res){
          myprofile =JSON.parse(res);
          this.shuffleProfile.push(myprofile.old);
          this.shuffleProfile.push(myprofile.height);
          this.shuffleProfile.push(myprofile.country);
          this.shuffleProfile.push(myprofile.job);
          this.shuffleProfile.push(myprofile.hobby);
          console.log('shuffleProfile',this.shuffleProfile);
        }
      });
    }

  }
  saveProfile(){
    this.dataService.getProfile().then(res=>{
      console.log("profile",this.room_id , this.my_id, res);
      this.GameService.makeProfile({ room_id:this.room_id , user_id : this.my_id, profile : JSON.parse(res)});
    });
  }

  makeArr(){
    this.clue_n = 0;
    this.live_n = 0;

    for(let i=0; i<this.AUsers.length; i++){
      if(this.AUsers[i].live){
        this.live_n++;
      }
      if(this.AUsers[i].juser_id === this.my_id){
        this.is_clue = this.AUsers[i].is_clue;

      }
      if(this.AUsers[i].live === false){
        if(this.AUsers[i].juser_id === this.my_id){
          if(this.is_live){
            let prompt = Alert.create({
              title: '사망 선고',
              message: "당신은 사망하였습니다.",
              buttons: ['Ok']
            });
          this.nav.present(prompt);
          this.SocketService.diconnectSocket();
          //this.nav.setRoot(TabsPage);
        }
          this.is_live =false;
        }
      }
      if(this.AUsers[i].is_clue){
        this.clue_n ++;
      }
    }
    if(this.is_clue){
      let toast = Toast.create({
        message: '당신은 범인입니다.!',
        duration: 3000
      });
      this.nav.present(toast);
    }
  }
  killAfter(){
    let zone = this.ngzone;
    this.socket.on('killafter',(userdata)=>{
      zone.run(()=>{
        console.log("afterkill",userdata);
        this.MUsers.pop();
        this.AUsers = userdata.gameuser;
      });

      this.makeArr();

      if(this.clue_n >= this.live_n){
        this.gameover(false);
      }else if(this.clue_n==0){
        this.gameover(true);
      }
      this.initTimer();
      this.startTimer();
    });
    this.socket.on('voteafter',( data )=>{
      this.makeArr();
      console.log('data',data);
      this.initTimer();
      this.startTimer();
    });
  }

  gameover(flag){
    if(flag){
      this.nav.push(GameresultPage,{result : flag});
      //this.nav.pop();
      //this.nav.setRoot(TabsPage);
    }
  }

  makeCurios(){
    if(!this.is_makecurios){
      this.is_makecurios = true;
      console.log("makeCurios");
      this.GameService.makeCurios(this.room_id,this.my_id).then( res =>{
        if(res){
        }
      });
      this.socket.on('updatecurios',(data)=>{
        console.log('data.cu',data);
        this.updateCuriosList(data.data);
      });
    }
  }

  updateCuriosList(data){
    console.log('data.user_id',data[0]);
    var uid = data[0].user_id;
    for( let i=0; i<this.AUsers.length; i++){
      console.log("Auser",this.AUsers[i].juser_id, uid);
      if(this.AUsers[i].juser_id === uid.toString()){
        console.log("test",this.AUsers[i]);
         this.AUsers[i].cusers = data[0].curios_peoples;
         break;
      }
    }
    for( let i=0; i<this.MUsers.length; i++){
      console.log("Muser",this.MUsers[i].juser_id, uid);
      if(this.MUsers[i].juser_id === uid.toString()){
         this.MUsers[i].cusers = data[0].curios_peoples;
         console.log("test",this.MUsers[i]);
         break;
      }
    }
  }

  hasFinished() {
      return this.timer.hasFinished;
  }

  initTimer() {
      if(!this.timeInSeconds) { this.timeInSeconds = 0; }
      this.timer = <CountdownTimer>{
          seconds: this.timeInSeconds,
          runTimer: false,
          hasStarted: false,
          hasFinished: false,
          secondsRemaining: this.timeInSeconds
      };
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      //this.startTimer();
  }

  startTimer() {
      this.timer.hasStarted = true;
      this.timer.runTimer = true;
      this.timerTick();
  }

  pauseTimer() {
      this.timer.runTimer = false;
  }

  resumeTimer() {
      this.startTimer();
  }

  timerTick() {
      setTimeout(() => {
          if (!this.timer.runTimer) { return; }
          this.timer.secondsRemaining--;
          this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
          if (this.timer.secondsRemaining > 0) {
              this.timerTick();
          }
          else {
              this.timer.hasFinished = true;
              console.log("Finished");
              if(this.MUsers.length === 0 ){
                this.socket.emit("votetime",{room_id : this.room_id ,vote_people : undefined, live_n : this.live_n, clue_n: this.clue_n});
              }
              else{
                this.socket.emit("votetime",{room_id : this.room_id ,vote_people : this.MUsers[0].juser_id, live_n : this.live_n, clue_n: this.clue_n});
              }

          }
      }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
      var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      var hoursString = '';
      var minutesString = '';
      var secondsString = '';
      hoursString = (hours < 10) ? "0" + hours : hours.toString();
      minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
      secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
      return hoursString + ':' + minutesString + ':' + secondsString;
  }


  openInventory(){
    console.log("bedge",this.BedgeArr);
    let modal = Modal.create(InventoryPage,{Bedgearr : this.BedgeArr});
    this.nav.present(modal);
    //this.nav.push(InventoryPage,{Bedgearr : this.BedgeArr});
  }

  playbarcode(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.barcode_count++;
      this.item_barcode = this.making_item(barcodeData.text);
      this.clue_barcode = this.making_clue(barcodeData.text);

      if( this.BedgeArr[this.item_barcode] === false){
        alert("벳지를 획득하였습니다!");
        this.BedgeArr[this.item_barcode] = new Object();
        this.BedgeArr[this.item_barcode]=true;
        this.is_full();
      }
      //alert("we got a barcode"+ this.item_barcode);
      //alert("we got a barcode"+ this.clue_barcode);
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
            this.barcode_count++;
            this.item_barcode = this.making_item(data.title);
            this.clue_barcode = this.making_clue(data.title);
            if( this.BedgeArr[this.item_barcode] === false){
              alert("벳지를 획득하였습니다!");
              this.BedgeArr[this.item_barcode] = new Object();
              this.BedgeArr[this.item_barcode] = true;
              this.is_full();
            }
            if( this.is_clue){
              this.putClue(this.clue_barcode);
            }else{
              this.getClue(this.clue_barcode);
            }
            //alert("we got a barcode"+ this.clue_barcode);
          }
        }
      ]
    });

    this.nav.present(prompt);
  }
  is_full(){
    for(let i=0; i<7; i++){
      if(this.BedgeArr[i]){
        this.is_fullitem=true;
      }else{
        this.is_fullitem=false;
        break;
      }
    }
  }

  moveA(user){
    let zone = this.zone;
    this.socket.emit('del_curios',{ room_id : this.room_id, u_id : user.juser_id, c_uid : this.my_id});
    zone.run(()=>{
      this.AUsers.push(user);
      this.MUsers.pop();

    });
  }

  moveM(user){
    if(this.MUsers.length<1){
      console.log("user",user);
      let zone = this.zone;
      var index=-1;

      for(let i=0; i<this.AUsers.length; i++){
        if(this.AUsers[i].juser_id === user.juser_id){
          index=i;
          break;
        }
      }

      this.socket.emit('add_curios',{ room_id : this.room_id, u_id : user.juser_id,  c_uid : this.my_id});
      zone.run(()=>{
        console.log("index",index);
        this.AUsers.splice(index,index+1);
        this.MUsers.push(user);
      });
    }else{
      let prompt = Alert.create({
        title: '의심 불가',
        message: "의심하는 인물은 1명만 가능합니다",
        buttons: [
          {
            text: 'Ok',
          },
        ]
      });
      this.nav.present(prompt);
    }
    //this.AUsers.slice(this.AUsers.indexOf(user.user_id));
  }

  putClue(num){
      var randindex = Math.floor(Math.random()*5);
      this.GameService.addDanseo({room_id : this.room_id, hash_id : num ,profile : this.shuffleProfile[randindex]});
      console.log('randindex',randindex);
      console.log('shuffle',this.shuffleProfile[randindex]);
  }
  getClue(num){
    this.GameService.getDanseo({room_id : this.room_id, hash_id : num }).then(res=>{
      if(res){
        console.log('res',res);
        let toast = Toast.create({
          message: '범인에 대한 단서는 '+res+'입니다.',
          duration: 3000
        });
        this.nav.present(toast);
      }else{

      }
    });
  }
  getsocket(){
    this.socket = this.SocketService.getSocket();
  }

  openProfile(user){
    var tuser = {room_id : this.room_id , user_id : user.juser_id};
    this.GameService.getProfile(tuser).then((res)=>{
      console.log('res',res);
      let modal = Modal.create(UserprofilePage,{ user : user.juser_name , data : res});
      this.nav.present(modal);

    });
  }

  making_item(barcode){
    return (barcode % this.item_making_value) % this.item_value;
  }

  making_clue(barcode){
    return (barcode % this.clue_making_value) % this.clue_value + 1;
  }
  //랜덤 생성 함수
  generateRandom(min, max) {
     return Math.floor(Math.random()*max) + min;
  }



  //changeNumber 생성구문

}
