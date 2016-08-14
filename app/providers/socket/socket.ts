import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { WaitingroomPage } from '../../pages/waitingroom/waitingroom';
import 'rxjs/add/operator/map';

/*
  Generated class for the Socket provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
declare var io;
@Injectable()
export class Socket {
  data: any;
  socket : any;
  serverUrl = "http://ec2-52-78-1-158.ap-northeast-2.compute.amazonaws.com:3333";
  //serverUrl ="http://localhost:3333";

  constructor(private http: Http, public ngzone : NgZone ) {
    this.data = null;
  }
  connectSocket(){
    console.log("url",this.serverUrl);
    this.socket = io(this.serverUrl);
  }
  diconnectSocket(){
    this.socket.disconnect();
  }
  getSocket(){
    return this.socket;
  }
}
