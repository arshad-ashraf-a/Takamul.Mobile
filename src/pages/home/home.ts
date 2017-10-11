import { SettingPage } from '../setting/setting';
import { CommonStorage } from '../../providers/common-storage';
import { PopoverMenuPage } from '../popover-menu/popover-menu';
import { UtilProvider } from '../../providers/util-provider';
import { AppData } from '../../providers/appdata';
import { ChatModalPage } from '../chat-modal/chat-modal';
import { Authentication } from '../../providers/authentication';
import { NewsModalPage } from '../news-modal/news-modal';
import { EventDetails } from '../event-details/event-details';
import { LoaderService } from '../../providers/loader-service';
import { ApiFactory } from '../../providers/api-factory';
import { Component, ViewChild, ElementRef, EventEmitter} from '@angular/core';

import {
    ActionSheetController,
    AlertController,
    ModalController,
    NavController,
    PopoverController,
    Slides
} from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage { 
  @ViewChild('eventSlide') eventSlide: Slides;
  @ViewChild('newsSlide') newsSlide: Slides;

  @ViewChild('newsDiv') newsDiv: ElementRef;
  @ViewChild('ticektsDiv') ticektsDiv: ElementRef;
  @ViewChild('eventsDiv') eventsDiv: ElementRef;
  @ViewChild('header') header: ElementRef;
  @ViewChild('footer') footer: ElementRef;

  page:string = 'HOME';
  keyboardShow = false;
  spinner = false;
  newsList = [];
  eventList = [];
  tickets = [];
  newsLoaded = false;
  eventLoaded = false;
  ticketsDivHeight:number;
  newsDivHeight:number;
  eventsDivHeight:number;
  headerHeight:number;
  footerHeight:number;
  appDetails:any = {};
  dir;
  firstTime = true;
  constructor(
    public navCtrl: NavController,
    private keyboard: Keyboard,
    private loader:LoaderService,
    private apiFactory:ApiFactory,
    public modalCtrl: ModalController,
    public auth:Authentication,
    public actionSheet:ActionSheetController,
    public appData:AppData,
    private util:UtilProvider,
    public popoverCtrl: PopoverController,
    public commonStorage:CommonStorage,
    private alertCtrl:AlertController
    ) {
    this.firstTime = !this.commonStorage.localHas('firstTime');
    this.dir =  this.appData.DIRECTION;

    this.keyboard.onKeyboardShow()
    .subscribe(()=>{
      this.keyboardShow = true;
    })

    this.keyboard.onKeyboardHide()
    .subscribe(()=>{
      this.keyboardShow = false;
    })
    
    this.util.appDetailsLoaded
      .subscribe(
        res => {
          if(!this.firstTime)
            this.loadHomeData()
        },
        err => {

        }
      )

    // this.util.languageChanged
    //   .subscribe(
    //     res => {
    //      this.loadHomeData()
    //     },
    //     err => {

    //     }
    //   )

    // this.appDetails = this.commonStorage.getItem("appDetails");
  }

  ionViewWillEnter(){
    if(this.dir != this.appData.DIRECTION)
    { 
       this.util.pageLoadEvent.next(this.appData.PAGE);
       this.dir = this.appData.DIRECTION;
      //  if(this.eventSlide)
      //     this.eventSlide.slideTo(0, 500);
      //  if(this.slides)
      //     this.slides.slideTo(0, 500);
       this.loadHomeData();
    }
    this.getTicketsHeight();
  }
  selectLanguage(ln){
    if(ln == 1){
      this.util.translateConfig('ar');
    }else if(ln == 2){
      this.util.translateConfig('en');
    }
    this.firstTime = false;
    this.commonStorage.localSet('firstTime','true');
    this.loadHomeData();
  }
  loadHomeData(){
     if(!this.commonStorage.getItem('appDetails').IsApplicationExpired){
        this.spinner = true;
        let userId = -99
        if(this.auth.isLoggedIn()){
          userId = this.auth.userId();
        }
        this.eventList = [];
        this.newsList = [];

        this.apiFactory.getHomeData(userId)
          .subscribe(result => {
            try{
              this.spinner = false;
              this.newsList = result.TakamulNewsList?result.TakamulNewsList:[];
              this.eventList = result.TakamulEventList?result.TakamulEventList:[];
              this.tickets = result.TakamulTicketList?result.TakamulTicketList:[];
              this.newsLoaded = true;
              this.eventLoaded = true;
              this.getTicketsHeight();
              setTimeout(
                () => {
                  try{
                    if(this.eventSlide)
                       this.eventSlide.slideTo(0);
                    if(this.newsSlide)
                       this.newsSlide.slideTo(0);
                    this.getTicketsHeight();
                  }catch(e){
                    
                  }
                }, 300
              )
            }catch(e){

            }
          },error => {
            this.spinner = false;
        });
      }
  }

  ngAfterViewInit() {
    this.headerHeight = this.header.nativeElement.offsetHeight;
    this.footerHeight = this.footer.nativeElement.offsetHeight;
  } 

  showPage(pageName){
    // this.page = pageName;
    this.appData.PAGE = pageName;
  }
  
  showDetails(id){
    let modal = this.modalCtrl.create(NewsModalPage,{
      id:id
    });
    modal.present();
  }

  showEventDetails(id){
    let modal = this.modalCtrl.create(EventDetails,{
      id:id
    });
    modal.present();
  }
    
  loadTickets(){
    if(!this.auth.isLoggedIn()) return;
    this.apiFactory.getTicketList(this.auth.userId())
      .subscribe(result => {
          this.tickets = result;
      },error => {

      });
  }

  getTicketsHeight(){
    if(this.newsLoaded && this.eventLoaded){
      setTimeout(() => {
        try{
            this.newsDivHeight = this.newsDiv.nativeElement.offsetHeight;
            this.eventsDivHeight =  this.eventsDiv.nativeElement.offsetHeight;
        }catch(e){
          
        }
      },300)
      // var offsetHeight = this.ticketsDivHeight;
      // console.log(this.ticketsDivHeight);
    }
  }


  showChat(id,ticketName){
    
    // let modal = this.modalCtrl.create(ChatModalPage,{
    //   id:id,
    //   title:ticketName
    // });
    // modal.present();
    this.navCtrl.push(ChatModalPage,{
      id:id,
      title:ticketName
    })
  }

  presentSettingActionSheet() {
    let actionSheet = this.actionSheet.create({
      buttons: [
        {
          text: this.util.tranlateInstant("settings"),
          handler: () => {
            console.log('Settings clicked');
          }
        },{
          text: this.util.tranlateInstant("logout"),
          handler: () => {
            this.auth.logout();
          }
        },{
          text: this.util.tranlateInstant("change_language"),
          handler: () => {
            // this.auth.logout();
            this.presentLanguageActionSheet();
          }
        },{
          text: this.util.tranlateInstant("cancel"),
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  presentLanguageActionSheet() {
    let actionSheet = this.actionSheet.create({
      buttons: [
        {
          text: this.util.tranlateInstant("english"),
          handler: () => {
            this.changeLange('en')
          }
        },{
          text: this.util.tranlateInstant("arabic"),
          handler: () => {
            this.changeLange('ar')
          }
        },{
          text: this.util.tranlateInstant("back"),
          role: 'cancel',
          handler: () => {
            this.presentSettingActionSheet();
          }
        }
      ]
    });
    actionSheet.present();
  }

  changeLange(ln){
    // let eventList = this.eventList;
    // this.eventList = [];
    this.util.translateConfig(ln);
    // setTimeout(()=>{
    //   this.eventList = eventList;
    // },200)
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverMenuPage);
    popover.present({
      ev: myEvent
    });
  }

  goToSetting(page){
    this.navCtrl.push(SettingPage,{
      page:page
    })
  }


  resolve(ticketId){
    let confirm = this.alertCtrl.create({
      title: 'Resolve Ticket',
      message: 'Do you want to resolve this ticket?',
      buttons: [
        {
          text: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.apiFactory.resolve(ticketId,this.auth.userId())
              .subscribe(
                res => {
                  if(res.OperationResult == 1){
                    this.loadTickets();
                  }
                  this.util.showToast(res.OperationResultMessage);
                },
                err => {

                }
              )
          }
        }
      ]
    });
    confirm.present();
  }

 delete(ticketId){
    let confirm = this.alertCtrl.create({
      title: 'Delete Ticket',
      message: 'Do you want to delete this ticket?',
      buttons: [
        {
          text: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.apiFactory.deleteTicket(ticketId,this.auth.userId())
              .subscribe(
                res => {
                  if(res.OperationResult == 1){
                    this.loadTickets();
                  }
                  this.util.showToast(res.OperationResultMessage);
                },
                err => {
                  let res = JSON.parse(err._body)
                  this.util.showToast(res.OperationResultMessage);
                }
              )
          }
        }
      ]
    });
    confirm.present();
  }

  setHeight(){
    // this.page = 'HOME';
    if(this.newsLoaded && this.eventLoaded){
      setTimeout(() => {
        try{
          this.newsDivHeight = this.newsDiv.nativeElement.offsetHeight;
          this.eventsDivHeight =  this.eventsDiv.nativeElement.offsetHeight;
        }catch(e){

        }
      },300)
    }
  }

  setPage(page){
    this.appData.PAGE = page;
    // this.util.pageLoadEvent
    //     .next(page);
  }
 
}
