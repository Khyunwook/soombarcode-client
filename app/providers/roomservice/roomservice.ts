import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Data } from '../data/data';
import 'rxjs/add/operator/map';

/*
  Generated class for the Roomservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Roomservice {

  data: any;
  serverUrl : string;
  ismakeroom : boolean;
  joinroomobj : any;

  constructor(private http: Http, public dataService : Data ) {
    this.http = http;
    this.data = null;
    this.ismakeroom = false;
    this.joinroomobj = new Object();
    //this.serverUrl = "http://ec2-52-78-1-158.ap-northeast-2.compute.amazonaws.com";
    this.serverUrl ="http://localhost";
    this.updateroomlist();
  }

  makeroom(roomobj){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log('roomservice',roomobj);
    return new Promise(resolve =>{
      this.http.post(this.serverUrl+':3333/room/makeroom', JSON.stringify(roomobj), {headers: headers})
        .subscribe(res => {
          if(res.json().success){
            console.log(res.json().token);
            this.updateroomlist();
            this.ismakeroom = true;
            resolve( this.makejoinroomobj(res.json(),roomobj));
            //this.storUserCredentials(res.json().token);
          }
          else{
            resolve(this.ismakeroom);
          }

        });
    });
  }
  getRooms(){
   return new Promise(resolve => {

     this.http.get(this.serverUrl+':3333/room/getrooms')
       .map(res => res.json())
       .subscribe(data => {
         console.log("res room",data);
         this.data = data;
         resolve(this.data);
       });
   });
  }

  updateroomlist(){
    this.getRooms().then(res =>{
      console.log("res",res);
      this.dataService.setRooms(res);
    });
  }
  makejoinroomobj(res,join_user){
    console.log('makeroom',res);
    let roomobj = {
      room_id : res.room.room_id,
      join_user_id : join_user.master,
      join_user_name : join_user.name,
      limit : res.room.nton,
      master : res.room.master
    };
    return roomobj;
  }
}
