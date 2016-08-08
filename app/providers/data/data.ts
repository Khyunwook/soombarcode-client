import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {
  data: any;
  storage: Storage;

  constructor(private http: Http) {
    this.storage = new Storage(SqlStorage, {name:'soombarcode'});
  }

  setUser(data: Object): void{
    let newData = JSON.stringify(data);
    this.storage.set('users',newData);
  }
  getUser(): Promise<any> {
    return this.storage.get('users');
  }

  setRooms(data: Object): void{
    let newData = JSON.stringify(data);
    this.storage.set('rooms', newData);
  }
  getRooms(): Promise<any> {
    return this.storage.get('rooms');
  }

  setInventory(data: Object):void{
    let newData = JSON.stringify(data);
    this.storage.set('inventory',newData);
  }
  getInventory(): Promise<any> {
    return this.storage.get('inventory');
  }
  destroy(){
    this.storage.clear();
  }

}
