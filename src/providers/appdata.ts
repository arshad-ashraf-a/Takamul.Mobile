import { Injectable } from '@angular/core';


@Injectable()
export class AppData {
  APP_NAME:string;
  BASE_URL:string;
  BASE_URL2:string;
  VERSION_NO_ANDROID:string;
  VERSION_NO_IOS:string; 
  VERSION_NO_WINDOWS:string;
  ONE_SIGNAL_APP_ID:string;
  APP_ID:number;
  DIRECTION:string;
  PAGE:string;
  SENDER_ID = "590793619189";
  THEME = "590793619189";
  LAT:number;
  LNG:number;
  constructor() {
    this.APP_NAME = "الجرداني تجريبي";
    this.VERSION_NO_ANDROID = "1.0";
    this.VERSION_NO_IOS = "1.0";
    this.VERSION_NO_WINDOWS = "1.0";
    this.ONE_SIGNAL_APP_ID = "6142738e-dd46-4ef6-8ac3-a30690d0f28d";
    this.BASE_URL = 'http://api.sawa.work/';
    this.APP_ID = 1;
    this.DIRECTION = 'rtl';
    this.PAGE = 'HOME'; 
    this.THEME = 'theme1'; 
        // this.BASE_URL2 = "http://crm.easio.in/"
  }
}
