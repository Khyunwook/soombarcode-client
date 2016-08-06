import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Data } from '../data/data';
import 'rxjs/add/operator/map';

/*
  Generated class for the Gameplay provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Gameplay {
  data: any;

  constructor(private http: Http) {
    this.data = null;
  }

}
