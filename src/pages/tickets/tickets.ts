import { CommonStorage } from '../../providers/common-storage';
import { NewChat } from '../new-chat/new-chat';
import { AppData } from '../../providers/appdata';
import { UtilProvider } from '../../providers/util-provider';
import { LoaderService } from '../../providers/loader-service';
import { ApiFactory } from '../../providers/api-factory';
import { emailValidator } from '../../providers/validators';
import { Authentication } from '../../providers/authentication';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, ModalController, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { ChatModalPage } from '../chat-modal/chat-modal';
import { Device } from '@ionic-native/device';


/*
  Generated class for the Tickets page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html'
})
export class TicketsPage {
  @ViewChild('ticketsDiv') ticketsDiv: ElementRef;
  loggedIn:boolean = false;
  signUpForm:any;
  otpForm:any;
  addForm:any;
  phoneForm:any;
  showOtp:boolean = false;
  showOtpFirst:boolean = false;
  spinner:boolean = false;
  showPhone:boolean = true;
  addNew = false;
  otpMsg = '';
  ticketsDivHeight:number;
  area = [];
  wilayat = [];
  village = [];
  tickets:any = [
    // {"title":"ticket 1","date":"21/02/2017"},
    // {"title":"ticket 2","date":"21/02/2017"},
    // {"title":"ticket 3","date":"21/02/2017"},
    // {"title":"ticket 5","date":"21/02/2017"},
    // {"title":"ticket 6","date":"21/02/2017"},
    ]
  showTickets = false;
  selectOptionsArea = {
    title: 'Select Area',
    mode: 'md'
  };
  selectOptionsVlllage = {
    title: 'Select Village',
    mode: 'md'
  };
  selectOptionsWilayat = {
    title: 'Select Wilayat',
    mode: 'md'
  };
  fromPN;
  langId;
  orLangId;
  direction;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth:Authentication,
    public formBuilder: FormBuilder,
    private apiFactory:ApiFactory,
    private loader:LoaderService,
    private util:UtilProvider,
    public modalCtrl: ModalController,
    private appData:AppData,
    private alertCtrl:AlertController,
    public commonStorage:CommonStorage,
    public device:Device) {
    this.langId = navParams.get('langId');
    this.fromPN = navParams.get('fromPN');
    if(this.fromPN){
      this.direction = appData.DIRECTION;
      if(this.langId){
        this.orLangId = this.commonStorage.localGet('langId');
        this.direction = this.langId == 1?'rtl':'ltr';
        if(this.langId == 1)
          this.util.translateConfig('ar');
        else
          this.util.translateConfig('en');
      }
    }
      this.validations();
      this.defaultCall();
      this.util.pageLoadEvent
        .subscribe(
          res => {
            if(res == 'TICKETS'){
              this.defaultCall();
            }
          }
        )
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TicketsPage');
  }

  ngAfterViewInit() {
    setTimeout(()=>{    
      this.ticketsDivHeight = this.ticketsDiv.nativeElement.offsetHeight;
    },200)
  } 

  defaultCall(){
    if(!this.auth.isLoggedIn()) return;
    this.spinner = true;
    this.apiFactory.getTicketList(this.auth.userId())
      .subscribe(result => {
        this.spinner = false;
          this.tickets = result;
          if(!this.tickets || this.tickets.length <= 0){
            this.showTickets = true;
          }else{
            this.showTickets = false;
          }
      },error => {
        this.spinner = false;
        if(error.TimeoutError){
          this.util.showAlert(this.util.tranlateInstant("time_exceeded"),this.util.tranlateInstant("time_exceeded"));
          console.log(error);
        }
        console.log(error);

      });
  }

  doRefresh(event){
    if(!this.auth.isLoggedIn()) return;
    this.spinner = true;
    this.apiFactory.getTicketList(this.auth.userId())
      .subscribe(result => {
        event.complete();
        this.spinner = false;
          this.tickets = result;
          if(!this.tickets || this.tickets.length <= 0){
            this.showTickets = true;
          }else{
            this.showTickets = false;
          }
      },error => {
        event.complete();
        this.spinner = false;
        if(error.TimeoutError){
          this.util.showAlert(this.util.tranlateInstant("time_exceeded"),this.util.tranlateInstant("time_exceeded"));
          console.log(error);
        }
        console.log(error);

      });
  }

  validations(){
   this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      // email: ['', Validators.compose([Validators.required, emailValidator])],
      email: ['',],
      phone:['', Validators.compose([Validators.maxLength(8),Validators.minLength(8), Validators.pattern('[0-9]*'), Validators.required])],
      civilId:['',],
      area:['',],
      wilayat:['', ],
      village:['', ],
    })

   this.otpForm = this.formBuilder.group({
      otp: ['', Validators.compose([ Validators.pattern('[0-9]*'), Validators.required])],
    })

   this.phoneForm = this.formBuilder.group({
      phone: ['',Validators.compose([Validators.maxLength(8),Validators.minLength(8), Validators.pattern('[0-9]*'), Validators.required])],
    })

  }
  
  limitNumber(value,limit){
    console.log(limit,value)
    if(value && value.length > limit){
      return value.substring(0,limit)
    }
    return value;
  }

  signUp(signupData){ 
    this.spinner = true;
    let data = signupData;
    signupData.wilayat = data.wilayat?data.wilayat.WILAYATCODE:"-99";
    signupData.area = data.area?data.area.AREACODE:"-99";
    signupData.village = data.village?data.village.VILLAGECODE:"-99";
    // let wt = this.wilayat.find( it => it.WILAYATCODE == signupData.wilayat);
    // let ar = this.area.find( it => it.AREACODE == signupData.area);
    // let vl = this.village.find( it => it.VILLAGECODE == signupData.village);
    signupData.wilayatName = data.wilayat?data.wilayat.WILLAYATNAME:'';
    signupData.areaName = data.area?data.area.AREA_NAME:'';
    signupData.villageName = data.village?data.village.VILLAGENAME:'';
    signupData.DeviceID = this.commonStorage.getItem('playerId') 
    this.auth.signup(signupData)
    .subscribe(
      res => {
        this.spinner = false;
          console.log(res);
        if(res.success){
          this.showOtp = true;
        }else{
          this.util.showToast(res.msg);
        }
        // if(res.OperationResult == -3){
        //   this.util.showToast(res.OperationResultMessage);
        // }
      },error => {
        this.spinner = false;
        if(error.body){
          this.util.showToast(error.body.message);
        }
        console.log(error);
      }
    )
  }

  otpValidateFirst(otpData){
    this.spinner = true;
    this.auth.validateOtpFirst(otpData,this.phoneForm.value.phone)
    .subscribe(
      res => {
        this.spinner = false;
          console.log(res);
        if(res.success){
          this.loggedIn = true;
        }
      }
    )
  }


  otpValidate(otpData:any){
    // if(otpData)
    //   {
    //     console.log('otpData',otpData);
    //     return 
    //   }
    this.spinner = true;
    this.auth.validateOtp(otpData.otp,this.phoneForm.value.phone)
    .subscribe(
      res => {
        this.spinner = false;
          console.log(res);
        if(res.success){
          this.loggedIn = true;
          this.util.showToast(res.msg)
          this.defaultCall();
        }else{
          this.util.showToast(this.util.tranlateInstant("wrong_otp"))
        }
      }
    )
  }

  phoneValidate(number){
    this.spinner = true;
    this.auth.validatePhone(number)
    .subscribe(
      res => {
        this.spinner = false;
          console.log(res);
        if(res.success){
          this.showOtp = true;
          this.showPhone = false;
          this.otpMsg = res.msg;
        }else{
          this.showOtp = false;
          this.showPhone = false;
          this.apiFactory.getAllArea()
          .subscribe(
            result => {
              this.area = result;
          })
          this.signUpForm.controls.phone.setValue(this.phoneForm.value.phone);
          setTimeout(
            () => {
              let elem = <any>document.querySelector('ion-input input');
              if (elem) {
                  elem.focus();
              }
            },600
          )
        }
      },err => {
        this.spinner = false;

      }
    )
  }
  
  resendOtp(number){
    this.spinner = true;
    if(this.signUpForm.value.phone){
      if(this.signUpForm.value.phone != number){
        number = this.signUpForm.value.phone;
      }
    }
    let data = {
      phone:number
    }

    this.auth.validatePhone(data)
    .subscribe(
      res => {
        this.spinner = false;
        if(res.success){
          this.util.showToast(res.msg);
        }else{
          this.util.showToast('OTP resend failed');
        }
      },err => {
        this.spinner = false;
          this.util.showToast('OTP resend failed');

      });
  }

  getUserDetailByPhone(data){
    this.spinner = true;
    this.apiFactory.getUserDetailByPhone(data.phone)
    .subscribe(
      res => {
        this.spinner = false;
          console.log(res);
        if(res && res.PhoneNumber){
          if(res.IsActive){
            this.showOtp = true;
            this.showPhone = false;
            this.otpMsg = res.msg;
          }else{
            this.util.showToast('user not active')
          }
        }else{
          this.showOtp = false;
          this.showPhone = false;
          this.apiFactory.getAllArea()
          .subscribe(
            result => {
              this.area = result;
          })
          this.signUpForm.controls.phone.setValue(this.phoneForm.value.phone);
          setTimeout(
            () => {
              let elem = <any>document.querySelector('ion-input input');
              if (elem) {
                  elem.focus();
              }
            },600
          )
        }
      },err => {
        this.spinner = false;

      }
    )
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

  createTicket(createData){

    let modal = this.modalCtrl.create(NewChat);
    modal.present();
    modal.onDidDismiss(
      res => {
        if(res){
          this.defaultCall();
        }
      }
    )
    // let data = {
    // 	"ApplicationID":this.appData.APP_ID,
    // 	"TicketName":createData.name,
    // 	"TicketDescription":createData.description
    // }
    // this.spinner = true;
    //  this.apiFactory.createTicketChat(this.auth.userId(),data)
    //   .subscribe(result => {
    //     this.spinner = false;
    //     if(result.OperationResult == 1){
    //       this.addNew = false;
    //       this.defaultCall();
    //       this.util.showToast(result.OperationResultMessage);
    //     }else{
    //       this.util.showToast(result.Message)
    //     }

    //   },error => {
    //     this.spinner = false;

    //   });
  }

  chatImageClick(i){
    if(this.tickets[i].imgShow){
      this.tickets[i].imgShow = false;
      return
    }
    for(let t of this.tickets){
      t.imgShow = false;
    }
    this.tickets[i].imgShow = true;
  }

  loadWilayat(area){
    this.signUpForm.controls['wilayat'].setValue(null);
    this.signUpForm.controls['village'].setValue(null);
      this.apiFactory.getAllWilayat(area.AREACODE)
      .subscribe(
        result => {
          this.wilayat = result;
      })
  }
  loadVillage(area,wilayat){
    this.signUpForm.controls['village'].setValue(null);
      this.apiFactory.getAllVillages(area.AREACODE,wilayat.WILAYATCODE)
      .subscribe(
        result => {
          this.village = result;
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
                  try{
                    if(res.OperationResult == 1){
                      this.defaultCall();
                    }
                    this.util.showToast(res.OperationResultMessage);
                  }catch(e){
                    this.util.showToast("Server error");
                  }
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
                 try{
                    if(res.OperationResult == 1){
                      this.defaultCall();
                    }
                    this.util.showToast(res.OperationResultMessage);
                  }catch(e){
                    this.util.showToast("Server error");
                  }
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
  
  ionViewWillLeave(){
    if(this.orLangId == 2)
      this.util.translateConfig('en');
    else if(this.orLangId == 1)
      this.util.translateConfig('ar');
  }

}
