import { UtilProvider } from '../../providers/util-provider';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CommonStorage } from '../../providers/common-storage';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  about:string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public commonStorage:CommonStorage,
    public socialSharing:SocialSharing,
    private util:UtilProvider
    ) {
      this.about = "About takamul";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage',null,null,'');
  }

  share(){
    this.socialSharing.share(this.about,null,null,'')      
    .then(
        ()=>{
          console.log("share success")
          // this.dismiss();
        },() =>{
          console.log("share failure")
          this.util.showToast("Failed to share  ");
        }
      );
  }

}
