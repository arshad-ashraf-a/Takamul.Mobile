import { CommonStorage } from '../../providers/common-storage';
import { Keyboard } from '@ionic-native/keyboard';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ActionSheetController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { AppData } from '../../providers/appdata';
import { ApiFactory } from '../../providers/api-factory';
import { LoaderService } from '../../providers/loader-service';
import { UtilProvider } from '../../providers/util-provider';
import { Authentication } from '../../providers/authentication';


import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';
import { Badge } from '@ionic-native/badge';
import { Clipboard } from '@ionic-native/clipboard';

declare var cordova: any;


@Component({
  selector: 'page-chat-modal',
  templateUrl: 'chat-modal.html'
})
export class ChatModalPage {

  lastImage: string = null;
  chatDetail:any = [];
  ticketDetail = {};
  spinner = false;
  replyMsg:string;
  ticketId:number;
  base64:string;
  ext:number;
  pageTitle = "";
  png=2;
  jpg=3;
  jpeg=4;
  doc=5;
  docx=6;
  pdf=7;
  interval;
  langId;
  orLangId;
  direction;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private apiFactory:ApiFactory,
    private loader:LoaderService,
    private util:UtilProvider,
    public viewCtrl: ViewController,
    public appData:AppData,
    public auth:Authentication,
    private camera: Camera, 
    private transfer: Transfer, 
    private file: File, 
    private filePath: FilePath,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private fileChooser: FileChooser,
    private cd: ChangeDetectorRef,
    private keyboard: Keyboard,
    private badge:Badge,
    private clipboard: Clipboard,
    public commonStorage:CommonStorage) {
      this.badge.clear();
    this.keyboard.onKeyboardShow()
    .subscribe(()=>{
      let sc = document.getElementById('scroll-top')
      sc.scrollTop = sc.scrollHeight;
    })
    this.ticketId = navParams.get('id');
    this.pageTitle = navParams.get('title');
    this.langId = navParams.get('langId');
    this.direction = appData.DIRECTION;
    if(this.langId){
      this.orLangId = this.commonStorage.localGet('langId');
      this.direction = this.langId == 1?'rtl':'ltr';
      if(this.langId == 1)
        this.util.translateConfig('ar');
      else
        this.util.translateConfig('en');
    }
    // this.util.onReply
    // .subscribe(
    //   res =>{
    //     console.log("this.chatDetail",res);
    //     if(res.success && res.reply.a){
    //       if(res.reply.a.TicketID && res.reply.a.TicketID == this.ticketId ){
    //         let chatItem = {
    //           "ApplicationID":1,
    //           "TicketID":res.reply.a.TicketID,
    //           "TicketChatID":"",
    //           "ReplyMessage":res.reply.a.ReplyMsg,
    //           "ReplyDate":res.reply.a.ReplyDate,
    //           "Base64ReplyImage":"",
    //           "RemoteFilePath":res.reply.a.RemoteFilePath,
    //           "UserID":res.reply.a.UserId,
    //           "TicketChatTypeID":res.reply.a.TicketChatType,
    //           "TicketChatTypeName":res.reply.a.Typename,
    //           "UserFullName":res.reply.a.Username
    //         }
    //         this.chatDetail.push(chatItem)
    //         this.cd.detectChanges();
    //         setTimeout(() => {
    //           let sc = document.getElementById('scroll-top')
    //           sc.scrollTop = sc.scrollHeight;
    //         },100);
    //       }
    //     }
    //   }
    // )

      this.interval = setInterval(
        () => {
          if(this.chatDetail.length){
            let last = this.chatDetail[this.chatDetail.length - 1];
            this.apiFactory.getTicketChatLast(this.ticketId, last.TicketChatID)
              .subscribe(
                res => {
                  console.log('res',res)
                  if(res){
                    this.chatDetail.push(res[0]);
                    setTimeout(() => {
                      let sc = document.getElementById('scroll-top')
                      sc.scrollTop = sc.scrollHeight;
                    },200);

                  }
                },err => {
                  
                }
              )
          }
        },5000
      )

  }
  ionViewDidLoad() {
    this.defaultCall(this.ticketId);
  }  

  defaultCall(id){
    this.spinner = true;
    this.apiFactory.getTicketChat(id)
      .subscribe(result => {
        this.spinner = false;
        this.chatDetail = result.TakamulTicketChatList;
        this.ticketDetail = result.TakamulTicket;
        setTimeout(() => {
          let sc = document.getElementById('scroll-top')
          sc.scrollTop = sc.scrollHeight;
          console.log("ticket  --- Detail",sc)
        },300);
        // sc[0].scrollTo(0,sc[0].scrollHeight);
        if(!result){
          this.chatDetail = [];
        }else if(result.ExceptionMessage){
          this.util.showToast(result.Message)
        }
      },error => {
        this.spinner = false;
      });
  }

  defaultCall2(id){
    this.apiFactory.getTicketChat(id)
      .subscribe(result => {
        this.chatDetail = result.TakamulTicketChatList;
        this.ticketDetail = result.TakamulTicket;
        setTimeout(() => {
          let sc = document.getElementById('scroll-top')
          sc.scrollTop = sc.scrollHeight;
        },100);
        if(!result){
          this.chatDetail = [];
        }else if(result.ExceptionMessage){
          this.util.showToast(result.Message)
        }
      },error => {

      });
  }
  


   dismiss(status:boolean) {
     let data = {status:status}
     this.viewCtrl.dismiss(data);
   }

   reply(){
     if(!this.replyMsg){
      return false;
     }
     let msg = this.replyMsg;
     this.replyMsg = "";
     this.autogrow();
      let data = {
        "ApplicationID": this.appData.APP_ID,
        "TicketID": this.ticketId,
        "ReplyMessage": msg,
        "UserID": this.auth.userId(),
        "TicketChatTypeID": 1,
        "Base64ReplyImage": ""
      }
      this.chatDetail.push({
        "ReplyMessage": msg,
        "ReplyDate":"Sending...",
        "UserID":this.auth.userId()
      });
      this.apiFactory.postTicketChat(data).subscribe(
        res => {
          this.defaultCall2(this.ticketId);
          if(res.OperationResult  != 1)
            this.util.showToast(res.OperationResultMessage)
        }, err => {
            this.util.showToast("Operation Failed")
        }
      );
       setTimeout(() => {
          let sc = document.getElementById('scroll-top')
          sc.scrollTop = sc.scrollHeight;
        },100);


   }
   attach(base64){
     this.chatDetail.push({
        "ReplyMessage": "",
        "ReplyDate":this.util.tranlateInstant("sending"),
        "UserID":this.auth.userId()
      });
      let data = {
        "ApplicationID": this.appData.APP_ID,
        "TicketID": this.ticketId,
        "ReplyMessage": "",
        "UserID": this.auth.userId(),
        "TicketChatTypeID": this.ext,
        "Base64ReplyImage": base64,
        "TicketChatTypeName": this.getTypeName(this.ext)
      }
      this.apiFactory.postTicketChat(data).subscribe(
        res => {
          this.defaultCall2(this.ticketId);
        }, err => {
          this.util.showAlert("",this.util.tranlateInstant("file_upload_failed"));
        }
      )
       setTimeout(() => {
          let sc = document.getElementById('scroll-top')
          sc.scrollTop = sc.scrollHeight;
        },100);
   }

  toBase64(fPath){
      let self = this;
      (window as any).plugins.Base64.encodeFile(fPath, function(base64){
        // console.log('file base64 encoding: ' + base64);
         self.base64 =  base64.substr(base64.indexOf("base64,")+7);
         let fileSize = ( 0.74 * self.base64.length ) / 1000;
         console.log("fileSize",fileSize)
         if(fileSize > 1024 * 10){
           self.util.showToast(self.util.tranlateInstant("file_size_limit"));
           return
         }
         self.attach(self.base64)
      });  
  }

   public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.util.tranlateInstant("select_file"),
      buttons: [
        {
          text: this.util.tranlateInstant("load_from_library"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        // {
        //   text: this.util.tranlateInstant("load_from_files"),
        //   handler: () => {
        //     this.loadFromFiles();
        //   }
        // },
        {
          text: this.util.tranlateInstant("use_camera"),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.util.tranlateInstant("cancel"),
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  
  checkExt(fName):any{
    if(fName.substring(fName.lastIndexOf(".")+1).indexOf('png') > -1 ){
      this.ext = this.png;
      return true;
    }else if(fName.substring(fName.lastIndexOf(".")+1).indexOf('jpg') > -1){
      this.ext = this.jpg;
      return true;
    }else if(fName.substring(fName.lastIndexOf(".")+1).indexOf('jpeg') > -1){
      this.ext = this.jpeg;
      return true;
    }else if(fName.substring(fName.lastIndexOf(".")+1).indexOf('doc') > -1 ){
      this.ext = this.doc;
      return true;
    }else if(fName.substring(fName.lastIndexOf(".")+1).indexOf('docx') > -1 ){
      this.ext = this.docx;
      return true;
    }else if(fName.substring(fName.lastIndexOf(".")+1).indexOf('pdf') > -1){
      this.ext = this.pdf;
      return true;
    }else{
      return false;
    }
  }

  loadFromFiles(){
    this.fileChooser.open()
      .then(uri => {
        this.filePath.resolveNativePath(uri)
            .then(filePath => {
              let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
              
              let currentName = filePath.substring(filePath.lastIndexOf('/') + 1);
              console.log("currentName ext",currentName,currentName.substring(currentName.lastIndexOf(".")+1));
              if(this.checkExt(currentName)){
                this.toBase64(filePath);
              }
              // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
            });
      })
      .catch(e => console.log(e));
  }

  public takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
           // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
              if(this.checkExt(currentName)){
                this.toBase64(filePath);
              }
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          if(this.checkExt(currentName)){
            this.toBase64(imagePath);
          }
      }
    }, (err) => {
      // this.presentToast( this.util.tranlateInstant("error_selecting_image"));
    });
  }

    private createFileName() {
      var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
      return newFileName;
    }
     
    // Copy the image to a local folder
    private copyFileToLocalDir(namePath, currentName, newFileName) {
      this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
        this.lastImage = newFileName;
      }, error => {
        this.presentToast(this.util.tranlateInstant("error_storing_file"));
      });
    }
     
    private presentToast(text) {
      this.util.showToast(text);
    }
     
    // Always get the accurate path to your apps folder
    public pathForImage(img) {
      if (img === null) {
        return '';
      } else {
        return cordova.file.dataDirectory + img;
      }
    }
    public getTypeName(typeId){
      if(typeId == 2)
        return "png";
      else if(typeId == 3)
        return "jpg";
      else if(typeId == 4)
        return "jpeg";
      else if(typeId == 5)
        return "doc";
      else if(typeId == 6)
        return "docx";
      else if(typeId == 7)
        return "pdf";
    }

    autogrow(){
      let  textArea = document.getElementById("textarea")       
      textArea.style.overflow = 'hidden';
      textArea.style.height = '0px';
      textArea.style.height = textArea.scrollHeight + 'px';
      if(!this.replyMsg){
        textArea.style.height = "20px";
      }
    }
    showCopy(chat){
      if(!chat.RemoteFilePath){
        chat.copySelected = true;
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Modify your album',
            buttons: [
              {
                text: 'Copy Message',
                handler: () => {
                  chat.copySelected = false;
                  cordova.plugins.clipboard.copy(chat.ReplyMessage);
                  this.autogrow();
                  console.log('Destructive clicked',chat.ReplyMessage);
                }
              },{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  chat.copySelected = false;
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          actionSheet.present();
      }
    }
    dbclickCall(){
      
    }


  ionViewWillLeave(){
    clearInterval(this.interval);
    if(this.orLangId == 2)
      this.util.translateConfig('en');
    else if(this.orLangId == 1)
      this.util.translateConfig('ar');
  }
}
