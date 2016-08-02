import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Data } from '../data/data';
import { Socket } from '../socket/socket';
import 'rxjs/add/operator/map';

/*
  Generated class for the Loginservice provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class Loginservice {
  data: any;
  isLoggedin : boolean;
  serverUrl : string;
  authToken : boolean;

  constructor(private http: Http, public dataService : Data, public SocketService : Socket) {
    this.http = http;
    this.isLoggedin = false;
    this.authToken = null;
    //this.serverUrl = "http://ec2-52-78-1-158.ap-northeast-2.compute.amazonaws.com";
    this.serverUrl ="http://localhost:3333";
  }

  login(credentials){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/auth/login', JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {
          if(res.json().success){
            //console.log(res.json().token);
            this.joinSocket();
            this.storeCredentials(res.json().token).then(res=>{
              if(res){
                resolve(res);
              }
            });
          }
        //  resolve(this.isLoggedin);
        });
    });

  }

  signin(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise(resolve => {
      this.http.post(this.serverUrl+'/auth/register', JSON.stringify(user), {headers: headers})
          .subscribe(res => {
            if(res.json().success){
              this.joinSocket();
              this.storeCredentials(res.json().token);
              resolve(true);
            }
            else
              resolve(false);
          });
        });
  }

  getUser(){
    let headers = new Headers();
    headers.append('Authorization', 'getuser ' + this.authToken);

    return new Promise(resolve => {
      this.http.get(this.serverUrl+'/auth/getInfo', {headers: headers}).subscribe(data => {
        resolve(data.json().msg);
      })
    });
  }

  logout(){
    this.isLoggedin = false;
    this.dataService.destroy();
  }


  storeCredentials(token){
    return new Promise(resolve => {
      this.authToken = token;
      this.getUser().then(res => {
        if(res){
          console.log("res",res);
          this.dataService.setUser(res);
          this.isLoggedin = true;
          resolve(true);
        }
      });

    });
  }
  joinSocket(){
    this.SocketService.connectSocket(this.serverUrl);
  }


}
