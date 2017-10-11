import { TicketsPage } from '../pages/tickets/tickets';
import { EventDetails } from '../pages/event-details/event-details';
import { NewsModalPage } from '../pages/news-modal/news-modal';
import { ChatModalPage } from '../pages/chat-modal/chat-modal';
import { CommonStorage } from '../providers/common-storage';
import { ApiFactory } from '../providers/api-factory';
import { UtilProvider } from '../providers/util-provider';
import { TranslateService } from 'ng2-translate';
import { AppData } from '../providers/appdata';
import { HomePage } from '../pages/home/home';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { Platform , Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Badge } from '@ionic-native/badge';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  templateUrl: 'app.html'
}) 
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage = HomePage;
  appDirection:string; 
  constructor(
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    public appData:AppData,
    private translate: TranslateService,
    private util:UtilProvider,
    private keyboard: Keyboard,
    public apiFactory:ApiFactory,
    public commonStorage:CommonStorage,
    public platform: Platform,
    private push: Push,
    private badge: Badge,
    private backgroundMode: BackgroundMode,
    private geolocation: Geolocation) {
      this.backgroundMode.enable();
    this.commonStorage.setItem("appDetails",{});
    if(!this.commonStorage.localHas('langId') || this.commonStorage.localGet('langId') == 2)
      this.util.translateConfig('en');
    else if(this.commonStorage.localGet('langId') == 1)
      this.util.translateConfig('ar');
    this.loadAppDetail();

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.appDirection = this.appData.DIRECTION;
      if(this.platform.is('cordova'))
        this.push.hasPermission()
          .then((res: any) => {
            if (res.isEnabled) {
              this.setupPushNotification();
            } else {
              console.log('We do not have permission to send push notifications');
            }
        });

        // let watch = this.geolocation.watchPosition();
        //   watch.subscribe((data) => {
        //    // data can be a set of coordinates, or an error (if an error occurred).
        //    // data.coords.latitude
        //    // data.coords.longitude
        //    this.appData.LNG = data.coords.longitude;
        //    this.appData.LAT = data.coords.latitude;
        //      console.log("this.appData.LAT",this.appData.LAT,this.appData.LNG);
        //   });
    });
  }


/**
   * set up push notification on device ready
   */
  setupPushNotification() {
    const pushObject: PushObject = this.push.init({
      android: {
        senderID: this.appData.SENDER_ID
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    });
    if (this.appData.ONE_SIGNAL_APP_ID) {
      pushObject.on('registration').subscribe( (data: any) => {
        this.commonStorage.setItem('deviceId',data.registrationId);
        this.apiFactory.postUrl('https://onesignal.com/api/v1/players',
          {
            app_id: this.appData.ONE_SIGNAL_APP_ID,
            device_type: 1,
            identifier: data.registrationId
          }).subscribe(
              result => {
                console.log(result)
                let res = JSON.parse(result._body);
                if(res.success){
                  this.commonStorage.setItem('playerId',res.id);
                }
                //alert(result);
              }
          )
        // this.apiFactory.storePlayerId("id=" + data.registrationId)
        //TODO - send device token to server
      });
      pushObject.on('notification').subscribe( (data: any) => {
        let self = this;
        // pushObject.setApplicationIconBadgeNumber(5)
        //   .then(
        //     () => {
        //       console.log("setApplicationIconBadgeNumber()");
        //     }
        //   );
        //   this.badge.increase(1);
        console.log("notification",data);
        // alert("recieved PN");
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
            if(data.additionalData && data.additionalData.custom){
              this.util.onReply.next({
                  success:true,
                  reply:data.additionalData.custom
              })
            }
        } else {
          if(data.additionalData && data.additionalData.custom){
            if(data.additionalData.custom.a){
              if(data.additionalData.custom.a.TicketID ){
                this.nav.push(ChatModalPage,{
                  id:data.additionalData.custom.a.TicketID,
                  title:""
                })
              }else if(data.additionalData.custom.a.NewsID){
                this.nav.push(NewsModalPage,{
                  id:data.additionalData.custom.a.NewsID,
                  langId:data.additionalData.custom.a.LanguageID
                });
              }else if(data.additionalData.custom.a.EventID){
                this.nav.push(EventDetails,{
                  id:data.additionalData.custom.a.EventID,
                  langId:data.additionalData.custom.a.LanguageID
                });
              }else if(data.additionalData.custom.a.Tickets){
                this.nav.push(TicketsPage,{
                  fromPN:true,
                  langId:data.additionalData.custom.a.LanguageID
                });
              }
            }
          }
        }
      });
      pushObject.on('error').subscribe( (e) => {
        // this.ex.call('MyApp', 'setupPushNotification()', e)
      });
    }

  }

  
  loadAppDetail(){
    this.apiFactory.getApplicationDetail()
    .subscribe(
      res => {
        if(res && res.ApplicationID){
          // res.IsApplicationExpired = false;
          this.commonStorage.setItem("appDetails",res);
          this.util.appDetailsLoaded.next(true);
        }
      }
    )
  }
}
