import { EventDetails } from '../event-details/event-details';
import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';
import { AppData } from '../../providers/appdata';
import { ApiFactory } from '../../providers/api-factory';
import { LoaderService } from '../../providers/loader-service';
import { UtilProvider } from '../../providers/util-provider';
import { Authentication } from '../../providers/authentication';
/*
  Generated class for the Events page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  showPastDate: boolean;
  showClear = false;
  eventList:any;
  type: any;
  spinner = false;
  // departureDateReturn: any = {};
  // minDateSelection = {};
  // departureDate: any = {
  //   day: 0, month: 0, year: 0, monthName: 'Jan', dayName: "Sun", formattedDate: '00-00-0000'
  // }
  // calendarStyling = {
  //   headerBackground: "#f96855",
  //   headerText: "#fff",
  //   btnPrimary: "#ed5f51",
  //   btnSecondary: "#fff",
  //   btnText: "#fff",
  //   height: '34px',
  //   width: '600px',
  //   firstDayOfWeek: 'su',
  //   dateFormat: 'dd-mm-yyyy',
  //   sunHighlight: true,
  //   deactivatePastDate: true
  // }
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
          if(res == 'EVENTS'){
            this.defaultCall();
          }
        }
      )
  }

  defaultCall(){
    // this.loader.showLoadingDefault();
    this.spinner = true;
    this.apiFactory.getEventList()
      .subscribe(result => {
        // this.loader.hideLoadingDefault();
        this.spinner = false;
          this.eventList = result;
      },error => {
        this.spinner = false;

      });
  }

  doRefresh(event){
    this.spinner = true;
    this.apiFactory.getEventList()
      .subscribe(result => {
        event.complete();
        this.spinner = false;
          this.eventList = result;
      },error => {
        event.complete();
        this.spinner = false;

      });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad EventsPage');
  }  

  // dateSelected(event) {
  //   //console.log("dateSelected modal",event);

  //   this.departureDate = event;
  // }

  showEventDetails(id){
    let modal = this.modalCtrl.create(EventDetails,{
      id:id
    });
    modal.present();
  }

}
