import { Component } from '@angular/core';
import { NavController, ViewController, Alert } from 'ionic-angular';
import {FormBuilder, ControlGroup, Validators} from '@angular/common';
import { Data } from '../../providers/data/data';
/*
  Generated class for the WriteProfilePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/write-profile/write-profile.html',
})
export class WriteProfilePage {

  profileForm: ControlGroup;

  constructor(private nav: NavController, public formBuilder: FormBuilder, public dataService: Data, public viewCtrl: ViewController) {
    this.profileForm = formBuilder.group({
      old:['',Validators.required],
      height:['',Validators.required],
      country:['',Validators.required],
      job:['',Validators.required],
      hobby:['',Validators.required]
    })
  }
  saveForm(event): void {
    event.preventDefault();
    if(this.profileForm.valid){
      console.log("form",this.profileForm.value);
      this.dataService.setProfile(this.profileForm.value);
      this.viewCtrl.dismiss(true);
    }
    else{
      let prompt = Alert.create({
        title: '프로필 작성',
        subTitle: '프로필을 모두 채워주세요!',
        buttons: ['OK']
      });
      this.nav.present(prompt);
    }
  }
}
