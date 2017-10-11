import { AppData } from './appdata';
import { TranslateService } from 'ng2-translate';
import { Platform } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';
import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// import {  Network, Toast, SocialSharing  } from '@ionic-native';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CommonStorage } from './common-storage';
import { ExceptionProvider } from './exception';



@Injectable()
export class UtilProvider {


  appDetailsLoaded = new EventEmitter();
  languageChanged = new EventEmitter();
  onReply = new EventEmitter();
  pageLoadEvent = new EventEmitter();
  private dayLabels = {1: 'sunday',2: 'monday', 3: 'tuesday',4: 'wednesday', 5: 'thursday', 6: 'friday', 7: 'saturday'};
  private monthLabels = { 1: 'jan', 2: 'feb', 3: 'mar', 4: 'apr', 5: 'may', 6: 'jun', 7: 'jul', 8: 'aug', 9: 'sep', 10: 'oct', 11: 'nov', 12: 'dec' };

  
  constructor(
    public http: Http,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private platform: Platform,
    private commonStorage:CommonStorage,
    private ex:ExceptionProvider,
    private toast: Toast,
    private socialSharing: SocialSharing,
    private network: Network,
    private translate: TranslateService,
    private appData:AppData
    ) {
  
  }
  
   
  translateConfig(ln){
    if(ln == 'ar'){
        console.log("lang ar",ln);
      this.commonStorage.localSet("langId",1);
      this.appData.DIRECTION = 'rtl';
    }else{
      this.commonStorage.localSet("langId",2);
      console.log("lang en",ln);
      this.appData.DIRECTION = 'ltr';
    }
    this.translate.setDefaultLang(ln);
    this.translate.use(ln);
  }

  /**
   * returns the day name as string 
   * @params day:number
   */
  getDayName(day:number):string{
    return this.dayLabels[day];
  }
  /**
   * returns the month name as string 
   * @params month:number
   */
  getMonthName(month:number):string{
    return this.monthLabels[month];
  }

  showToast(msg,postion='top'){
    if(!this.platform.is('cordova')){
       let toast = this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position: postion
        });
        toast.present();
    }else{
      this.toast.show(msg, '3000',  'bottom').subscribe(
        toast => {
          
        }
      );
    }
  }

  showAlert(title,msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: this.tranlateInstant(msg),
      buttons: [this.tranlateInstant('ok')]
    });
    alert.present();
  }
  
  platformName():string{
    let platformName:string;
    if(this.platform.is('ios')){
        platformName = 'IOS';
    }else if(this.platform.is('android')){
        platformName = 'Android';
    }else if(this.platform.is('windows')){
        platformName = 'Windows';
    }else{
      platformName = "Web";
    }
    return platformName;
  }


  checkConnection():boolean{
    console.log("this.network.type",this.network.type,this.network.type,this.platform.is('cordova'));
    if((this.network.type === 'none' || !this.network.type) && this.platform.is('cordova')){
      this.showToast(this.tranlateInstant("no_internet"));
      return false;
    } 
    return true;
  }

  isConnected(){
    if((this.network.type === 'none' || !this.network.type) && this.platform.is('cordova')){
      return false;
    }
    return true;
  }


  tranlateInstant(local):string{
    return this.translate.instant(local);
  }



    changeDateFormat(date:string,fromFormat="mm/dd/yyyy",toFormat="dd/mm/yyyy"){
      let d=0,m=0,y=0;

      if(fromFormat=="dd/mm/yyyy" || fromFormat=="dd-mm-yyyy"){
          d = +date.substr(0,2);
          m = +date.substr(3,2);
          y = +date.substr(6,4);
      }else  if(fromFormat=="mm/dd/yyyy" || fromFormat=="mm-dd-yyyy"){
          m = +date.substr(0,2);
          d = +date.substr(3,2);
          y = +date.substr(6,4);
      }else  if(fromFormat=="yyyy/mm/dd" || fromFormat=="yyyy-mm-dd"){
          y = +date.substr(0,4);
          m = +date.substr(5,2);
          d = +date.substr(8,2);
      }

      toFormat = toFormat.replace(/yyyy/g,this.preZero(y));
      toFormat = toFormat.replace(/mm/g,this.preZero(m));
      toFormat = toFormat.replace(/dd/g,this.preZero(d));
      return toFormat;
    }
     preZero(val):string {
        // Prepend zero if smaller than 10
        return val < '10' ? '0' + val : val;
    }
}
