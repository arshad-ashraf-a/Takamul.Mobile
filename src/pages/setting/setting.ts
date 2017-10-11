import { ProfilePage } from '../profile/profile';
import { TermsPage } from '../terms/terms';
import { HowItWorksPage } from '../how-it-works/how-it-works';
import { FaqPage } from '../faq/faq';
import { AppData } from '../../providers/appdata';
import { Authentication } from '../../providers/authentication';
import { UtilProvider } from '../../providers/util-provider';
import { AboutPage } from '../about/about';
import { CommonStorage } from '../../providers/common-storage';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  lang:boolean;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public commonStorage:CommonStorage,
    public util:UtilProvider,
    private socialSharing: SocialSharing,
    public auth:Authentication,
    public appData:AppData
    ) {
      this.lang = commonStorage.localGet("langId") == 2?false:true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  about(){
    this.navCtrl.push(AboutPage);
  }

  faq(){
    this.navCtrl.push(FaqPage);
  }
  howItWorks(){
    this.navCtrl.push(HowItWorksPage);
  }
  terms(){
    this.navCtrl.push(TermsPage);
  }
  menus(){
    // this.navCtrl.push(AboutPage);
  }
  profile(){
    this.navCtrl.push(ProfilePage);
  }

  help(){

  }
  
  share(){
    this.socialSharing.share(this.commonStorage.getItem('appDetails').ApplicationName,null,null,'');
  }

  toggle(lang){
    if(lang){
      this.util.translateConfig('ar');
    }else{
      this.util.translateConfig('en');
    }
    this.util.languageChanged.next(true);
  }

  logout(){
    this.auth.logout();
    this.appData.PAGE = 'HOME';
    this.navCtrl.pop();
  }



  
}
