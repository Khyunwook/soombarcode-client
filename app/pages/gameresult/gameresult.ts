import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/gameresult/gameresult.html',
})
export class GameresultPage {

  is_result : any;

  constructor(private nav: NavController, public navParams : NavParams, public Tabspage :TabsPage ) {
    this.is_result = this.navParams.get('result');
  }
  exit(){
    this.nav.setRoot(this.Tabspage);
  }

}
