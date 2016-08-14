import { Component } from '@angular/core';
import { NavController,NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the UserprofilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/userprofile/userprofile.html',
})
export class UserprofilePage {

  data :any;
  userinfo : any;

  constructor(private nav: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.userinfo = this.navParams.get('user');
    this.data = this.navParams.get('data')
  }
  dismiss() {
    this.viewCtrl.dismiss();
    //this.nav.pop();
  }

}
