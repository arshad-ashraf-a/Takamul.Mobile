import { UtilProvider } from '../../providers/util-provider';
import { ApiFactory } from '../../providers/api-factory';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Admin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html'
})
export class AdminPage {
  tabs:string = 'tab1';
  members = [];
  spinner = false;
  memberTab = '0';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private apiFactory:ApiFactory,
    private util:UtilProvider) {
    this.loadData();
     this.util.pageLoadEvent
        .subscribe(
          res => {
            if(res == 'ADMIN'){
              this.loadData();
            }
          }
        )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');

  }

  loadData(){
      this.spinner = true;
      this.apiFactory.getMemberInfo()
      .subscribe(
        res => {
          this.spinner = false;
          if(res){
            this.members = res;
          }
        },err => {
          this.spinner = false;
        }
      )
  }

  segmentChanged(ev){
    console.log(ev);
  }

}
