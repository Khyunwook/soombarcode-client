import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { Data } from '../../providers/data/data';
import { Loginservice } from '../../providers/loginservice/loginservice';


@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  User : any;

  constructor(private nav: NavController, private LoginService : Loginservice, private dataService: Data) {
    this.User = {
      username : null
    };
     //console.log("usern",this.User.username);
    this.dataService.getUser().then(res=>{
       let currentUser = JSON.parse(res);
       this.User = currentUser;
      });
  }


  logout(){
    this.LoginService.logout();
    this.nav.rootNav.setRoot(LoginPage);
  }
}
