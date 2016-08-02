import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { Loginservice } from '../../providers/loginservice/loginservice';

/*
  Generated class for the SignupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/signup/signup.html',
})
export class SignupPage {
  id: string;
  username: string;
  password: string;
  confirmPassword: string;

  constructor(private nav: NavController, private http: Http, private LoginService: Loginservice) {

  }

  register() {
    let user = {
      userid: this.id,
      username: this.username,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    this.LoginService.signin(user).then(res => {
      if(res){
        this.nav.setRoot(TabsPage);
      }
    });
  }

}
