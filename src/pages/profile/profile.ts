import { Authentication } from '../../providers/authentication';
import { UtilProvider } from '../../providers/util-provider';
import { LoaderService } from '../../providers/loader-service';
import { ApiFactory } from '../../providers/api-factory';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profile;
  spinner = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiFactory:ApiFactory,
    private loader:LoaderService,
    private util:UtilProvider,
    private auth:Authentication,
  ) {
    this.defaultCall();  
  }

  
  defaultCall(){
    this.spinner = true;
    this.apiFactory.getUserDetail(this.auth.userId())
      .subscribe(result => {
        this.spinner = false;
          this.profile = result;
      },error => {
        this.spinner = false;

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
