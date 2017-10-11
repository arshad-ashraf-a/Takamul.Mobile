import { AppData } from '../../providers/appdata';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  origin:any;
  destination:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public appData:AppData) {
    this.origin = navParams.get('origin');
    this.destination = navParams.get('destination');
    this.origin = { longitude:this.appData.LNG, latitude:this.appData.LAT };  // its a example aleatory position
    // this.destination = { longitude: 58.5604, latitude: 23.5867 };  // its a example aleatory position
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
    // this.origin = { longitude: 58.4016, latitude:23.5854 };  // its a example aleatory position
    // this.destination = { longitude: 58.5604, latitude: 23.5867 };  // its a example aleatory position
  }

   dismiss(status:boolean) {
     let data = {status:status}
     this.viewCtrl.dismiss(data);
   }

}
