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

  constructor(private http: Http, public ngzone : NgZone ) {
    this.data = null;
  }
  connectSocket(server_url : string){
    console.log("url",server_url);
    this.socket = io(server_url);
  }
  getSocket(){
    return this.socket;
  }
}
