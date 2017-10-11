import { UtilProvider } from '../../providers/util-provider';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CommonStorage } from '../../providers/common-storage';
import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public commonStorage:CommonStorage,
    public socialSharing:SocialSharing,
    private util:UtilProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPage');
  }

}
