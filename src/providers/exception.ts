import { NavController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Exception provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ExceptionProvider {

  constructor(public http: Http) {
  }

  call(component:string,method:string,exception:any,reason:string = null){
    console.log("Exception -> component: " + component + " -> method: " + method + " -> exception: ",exception,'reason: ',reason );
  }

}
