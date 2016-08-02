import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { Loginservice } from '../../providers/loginservice/loginservice';
/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  id : string;
  password : string;

  constructor(private nav: NavController, private http: Http, private LoginService: Loginservice) {

  }
  login(){
    let credentials = {
      userid: this.id,
      password: this.password
    };

    this.LoginService.login(credentials).then( res=> {
      if(res)
        this.nav.setRoot(TabsPage);
    });
  }
  launchSignup(){
    this.nav.push(SignupPage);
  }
}
