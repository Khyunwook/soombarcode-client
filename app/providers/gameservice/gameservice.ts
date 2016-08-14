import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Data } from '../data/data';
import { Socket } from '../socket/socket';
import 'rxjs/add/operator/map';


/*
  Generated class for the Gameservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Gameservice {
  data: any;
  serverUrl : string;

  constructor(private http: Http, public dataService : Data, public SocketService : Socket) {
    this.http = http;
    this.serverUrl = "http://ec2-52-78-1-158.ap-northeast-2.compute.amazonaws.com:3333";
    //this.serverUrl ="http://localhost:3333";
  }

  makeDanseo(room_id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/danseo/makeDanseo', JSON.stringify(room_id), {headers: headers})
          .subscribe(res => {
            if(res.json().success){
              resolve(true);
            }
            else
              resolve(false);
          });
        });
  }
  addDanseo(danseo){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/danseo/addDanseo', JSON.stringify(danseo), {headers: headers})
          .subscribe(res => {
            if(res.json().success){
              resolve(true);
            }
            else
              resolve(false);
          });
        });
  }
  getDanseo(danseo){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/danseo/getDanseo', JSON.stringify(danseo), {headers: headers})
          .subscribe(res => {
            if(res.json().success){
              resolve(res.json().danseo.danseo);
            }
            else{
              resolve(false);
            }
          });
        });
  };
  makeProfile(profile){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/profile/makeProfile', JSON.stringify(profile), {headers: headers})
          .subscribe(res => {
            if(res.json().success){
              resolve(res.json());
            }
            else{
              resolve(false);
            }
          });
        });
  }
  getProfile(profile){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/profile/getProfile', JSON.stringify(profile), {headers: headers})
          .subscribe(res => {
            if(res.json().success){
              resolve(res.json());
            }
            else{
              resolve(false);
            }
          });
        });
  }
  makeCurios(room_id, my_id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var curiosobj = {
      room_id : room_id,
      user_id : my_id
    };
    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/curios/makeCurios', JSON.stringify(curiosobj), {headers: headers})
          .subscribe(res => {
            if(res.json().success){
              console.log("curiosmake");
              resolve(res.json());
            }
            else{
              resolve(false);
            }
          });
        });
  }

}
