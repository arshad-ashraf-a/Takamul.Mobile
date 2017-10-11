import { CommonStorage } from '../../providers/common-storage';
import { MapPage } from '../map/map';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Component } from '@angular/core';
import { ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { AppData } from '../../providers/appdata';
import { ApiFactory } from '../../providers/api-factory';
import { LoaderService } from '../../providers/loader-service';
import { UtilProvider } from '../../providers/util-provider';
import { Authentication } from '../../providers/authentication';

/**
 * Generated class for the EventDetails page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetails {
  eventDetail:any;
  spinner = false;
  pageTitle = "";
  lat:number;
  lng:number;
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
    public platform:Platform,
    public modalCtrl: ModalController,
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
    this.pageTitle = this.util.tranlateInstant("event_detail")
    this.defaultCall(id);
  }

  defaultCall(id){
    this.spinner = true;
    this.apiFactory.getEventDetail(id)
      .subscribe(result => {
        this.spinner = false;
        this.lat = +result.Latitude;
        this.lng = +result.Longitude;
        this.pageTitle = result.EVENTNAME;
        this.eventDetail = result;
      },error => {
        this.spinner = false;

      });
  }

   dismiss(status:boolean) {
     let data = {status:status}
     this.viewCtrl.dismiss(data);
   }
   openMap(){
    //  if(this.platform.is('ios'))
    //       window.open("http://maps.apple.com/?ll=" + this.lat + "," + this.lng + "&near=" + this.lat + "," + this.lng + "", '_system', 'location=yes')  
    //  else 
    //      window.open("google.navigation:q=23.3728831,85.3372199&mode=d" , '_system', 'location=yes');

    window.open("https://www.google.com/maps/dir/?api=1&origin=&destination=" + this.lat + "," + this.lng)
    
    // let modal = this.modalCtrl.create(MapPage,
    //   {
    //     destination:{ longitude: this.lng, latitude:this.lat },
    //     origin:{ longitude: this.lng, latitude:this.lat }
    //   }
    // );
    // modal.present();
    // modal.onDidDismiss(
    //   res => {
    //     if(res){
    //     }
    //   }
    // )
   }


  share(){
    let msg = this.eventDetail.EVENTNAME + "\n"
    msg += this.eventDetail.EVENTDESCRIPTION + "\n ----------- \n"
    msg += this.commonStorage.getItem('appDetails').ApplicationName + "\n"
    msg += "PlayStore URL: " + this.commonStorage.getItem('appDetails').PlayStoreURL + "\n"
    msg += "AppStore URL: " + this.commonStorage.getItem('appDetails').AppStoreURL + "\n"
    this.socialSharing.share(this.eventDetail.EVENTDESCRIPTION,null,null,'')   
    .then(
        ()=>{
          console.log("share success")
          // this.dismiss();
        },() =>{
          console.log("share failure")
          this.util.showToast("Failed to share");
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
