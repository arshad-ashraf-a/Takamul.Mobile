import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AppData } from '../../providers/appdata';
import { ApiFactory } from '../../providers/api-factory';
import { LoaderService } from '../../providers/loader-service';
import { UtilProvider } from '../../providers/util-provider';
import { Authentication } from '../../providers/authentication';
import { ModalController } from 'ionic-angular';
import { NewsModalPage } from '../news-modal/news-modal';

/*
  Generated class for the News page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})
export class NewsPage {
  newsList:any;
  spinner = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiFactory:ApiFactory,
    private loader:LoaderService,
    private util:UtilProvider,
    public auth:Authentication,
    public modalCtrl: ModalController) {
    this.defaultCall();
    this.util.pageLoadEvent
      .subscribe(
        res => {
          if(res == 'NEWS'){
            this.defaultCall();
          }
        }
      )
  }

  defaultCall(){
    this.spinner = true;
    this.apiFactory.getNewsList()
      .subscribe(result => {
        this.spinner = false;
          this.newsList = result;
      },error => {
        this.spinner = false;

      });
  }

  doRefresh(event){
    this.spinner = true;
    this.apiFactory.getNewsList()
      .subscribe(result => {
        event.complete();
        this.spinner = false;
          this.newsList = result;
      },error => {
        event.complete();
        this.spinner = false;

      });
  }

  showDetails(id){
    let modal = this.modalCtrl.create(NewsModalPage,{
      id:id
    });
    modal.present();
  }
  
}
