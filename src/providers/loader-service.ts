import { LoadingController } from 'ionic-angular';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LoaderService {
  loader:any;
  wheelLoaderEvent = new EventEmitter();
  constructor(public loadingCtrl: LoadingController ) {

}


  showLoadingDefault() {
    this.loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    
     // console.log("showLoadingDefault()");
    this.loader.present();
  }
  
  hideLoadingDefault(){
     console.log("hideLoadingDefault()");
      
      // setTimeout(() => {
        this.loader.dismiss();
      // },300);
  }
  
}
