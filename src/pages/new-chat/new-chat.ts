import { AppData } from '../../providers/appdata';
import { UtilProvider } from '../../providers/util-provider';
import { LoaderService } from '../../providers/loader-service';
import { ApiFactory } from '../../providers/api-factory';
import { emailValidator } from '../../providers/validators';
import { Authentication } from '../../providers/authentication';
import { Component } from '@angular/core';
import { ActionSheetController, Platform,  ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';


import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { FileChooser } from '@ionic-native/file-chooser';

declare var cordova: any;

@Component({
  selector: 'page-new-chat',
  templateUrl: 'new-chat.html',
})
export class NewChat {

  addForm:any;
  showOtp:boolean = false;
  spinner:boolean = false;
  lastImage: string = null;
  base64:string;
  ext:number;
  pageTitle = "";
  png=2;
  jpg=3;
  jpeg=4;
  doc=5;
  docx=6;
  pdf=7;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public auth:Authentication,
    public formBuilder: FormBuilder,
    private apiFactory:ApiFactory,
    private loader:LoaderService,
    private util:UtilProvider,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
        private appData:AppData,
    private camera: Camera, 
    private transfer: Transfer, 
    private file: File, 
    private filePath: FilePath,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private fileChooser: FileChooser) {

   this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewChat');
  }

  createTicket(createData){
    let data = {};
    if(!this.base64)
      data = {
      	"ApplicationID":this.appData.APP_ID,
      	"TicketName":createData.name,
      	"TicketDescription":createData.description
      }
    else
      data = {
        "ApplicationID":this.appData.APP_ID,
        "TicketName":this.addForm.value.name,
        "TicketDescription":this.addForm.value.description,
        "Base64DefaultImage": this.base64,
        "DefaultImageType":this.ext,
      }
    this.spinner = true;
     this.apiFactory.createTicketChat(this.auth.userId(),data)
      .subscribe(result => {
        this.spinner = false;
        if(result.OperationResult == 1){
          this.viewCtrl.dismiss(true)
          this.util.showToast(result.OperationResultMessage);
        }else{
          if(result.Message)
            this.util.showToast(result.Message);
          else
            this.util.showToast(result.OperationResultMessage);
        }

      },error => {
        this.spinner = false;

      });
  }
  
  dismiss(){
     this.viewCtrl.dismiss(false)
  }


  attach(base64){
    this.base64 = base64;
      // let data = {
      // 	"ApplicationID":this.appData.APP_ID,
      // 	"TicketName":this.addForm.value.name,
      // 	"TicketDescription":this.addForm.value.description,
      //   "Base64DefaultImage": base64,
      //   "DefaultImageType":this.ext,
      // }
      // this.apiFactory.postTicketChat(data).subscribe(
      //   result => {
      //     this.spinner = false;
      //     if(result.OperationResult == 1){
      //       this.viewCtrl.dismiss(true)
      //       this.util.showToast(result.OperationResultMessage);
      //     }else{
      //       this.util.showToast(result.Message)
      //     }
      //   }, err => {
      //     this.util.showAlert("","file upload Failed");
      //   }
      // )
   }

  toBase64(fPath){
      if(!this.isImage(this.ext)){
           this.util.showToast(this.util.tranlateInstant("invalid_image"));
      }
      let self = this;
      (window as any).plugins.Base64.encodeFile(fPath, function(base64){
        // console.log('file base64 encoding: ' + base64);
        //  self.base64 =  base64;
         self.base64 =  base64.substr(base64.indexOf("base64,")+7);
         let fileSize = ( 0.74 * self.base64.length ) / 1000;
         console.log("fileSize",fileSize)
         if(fileSize > 1024 * 2){
           self.ext = null;
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
              console.log("currentName ext",currentName);
           // this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
              if(this.checkExt(currentName)){
                this.toBase64(filePath);
              }
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        console.log("currentName ext",currentName);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          if(this.checkExt(currentName)){
            this.toBase64(imagePath);
          }
      }
    }, (err) => {
      this.presentToast( this.util.tranlateInstant("error_selecting_image"));
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

    isImage(typeId){
      if(typeId == 2 || typeId == 3 || typeId == 4){
        return true;
      }
      return false;
    }
}
