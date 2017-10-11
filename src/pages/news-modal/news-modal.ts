import { CommonStorage } from '../../providers/common-storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppData } from '../../providers/appdata';
import { ApiFactory } from '../../providers/api-factory';
import { LoaderService } from '../../providers/loader-service';
import { UtilProvider } from '../../providers/util-provider';
import { Authentication } from '../../providers/authentication';
/*
  Generated class for the NewsModal page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-news-modal',
  templateUrl: 'news-modal.html'
})
export class NewsModalPage {
  newsDetail:any;
  spinner = false;
  direction;
  langId;
  orLangId;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiFactory:ApiFactory,
    private loader:LoaderService,
    private util:UtilProvider,
    public viewCtrl: ViewController,
    public appData:AppData,
    public socialSharing:SocialSharing,
    public commonStorage:CommonStorage) {
    let id = navParams.get('id');
    this.langId = navParams.get('langId');
    this.direction = appData.DIRECTION;
    if(this.langId){
      this.orLangId = this.commonStorage.localGet('langId');
      this.direction = this.langId == 1?'rtl':'ltr';
      if(this.langId == 1)
        this.util.translateConfig('ar');
      else
        this.util.translateConfig('en');
    }
    this.defaultCall(id);
  }

  defaultCall(id){
    this.spinner = true;
    this.apiFactory.getNewsDetail(id)
      .subscribe(result => {
        this.spinner = false;
        this.newsDetail = result;
      },error => {
        this.spinner = false;

      });
  }

   dismiss(status:boolean) {
     let data = {status:status}
     this.viewCtrl.dismiss(data);
   }
  

  share(){
    let msg = this.newsDetail.NewsTitle + "\n"
    msg += this.newsDetail.NewsContent + "\n ----------- \n"
    msg += this.commonStorage.getItem('appDetails').ApplicationName + "\n"
    msg += "PlayStore URL: " + this.commonStorage.getItem('appDetails').PlayStoreURL + "\n"
    msg += "AppStore URL: " + this.commonStorage.getItem('appDetails').AppStoreURL + "\n"
    this.socialSharing.share(msg,null,null,'')   
    .then(
        ()=>{
          console.log("share success")
          // this.dismiss();
        },() =>{
          console.log("share failure")
          this.util.showToast("Failed to share ");
        }
      );
  }

  ionViewWillLeave(){
    if(this.orLangId == 2)
      this.util.translateConfig('en');
    else if(this.orLangId == 1)
      this.util.translateConfig('ar');
  }
}
