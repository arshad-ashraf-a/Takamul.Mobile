import { CommonStorage } from './common-storage';
import { AppData } from './appdata';
import { UtilProvider } from './util-provider';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
/*
  Generated class for the Authentication provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Authentication {
 public token: string;
    BASE_URL = '';
    headers:any;
    options:any;
    platformName:string;
    constructor(
        private http: Http,
        private appData:AppData,
        private util:UtilProvider,
        private commonStorage:CommonStorage
    ) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.platformName = this.util.platformName();
        this.headers = new Headers({ });
        this.headers.append("enctype", "multipart/form-data");
        this.headers.append("ontent-type", "application/json");
        this.options = new RequestOptions({ headers: this.headers });
        this.BASE_URL = this.appData.BASE_URL;
        console.log("AuthenticationService --> constructor, platformName ",this.token, this.platformName);
    }
 
/**
 * login code 
 */
    login(ID: string, PW: string): Observable<any> {
        //     return this.http.post(this.BASE_URL + 'api2/singup.json?', { "user" : {"ID": ID, "password": password , "password_confirmation": password,"first_name": "Bitla","mobile_number": "9658574120","dob": "2014-12-22"} }, this.options)
        let data = {"id": ID, "PW": PW};
        console.log(data);
        
            return this.http.post(this.BASE_URL + 'API/AppLogin.aspx?ID='+ID+'&PW='+PW,'{}')
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                try{
                    let result = response.json()
                    if (result.success) {
                        // set token property
                        // store ID and auth token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify({ ID: ID, PW: PW, Role:"STUDENT", userFull: result.body[0]}));
     
                        // return true to indicate successful login
                        return result;
                    } else {
                        // return false to indicate failed login
                        return result;
                    }
                }catch(e){
                    console.log("Exception in AuthenticationService --> login()",e)
                    return {success:false,body:{message:"Login Failed try after sometime"}};
                }
            });
    } 

/**
 * signup code 
 */
    
    signup(signupData:any): Observable<any> {
        let data = {
            "ApplicationID":this.appData.APP_ID,
            "PhoneNumber": signupData.phone,
            "FullName": signupData.name,
            "Email": signupData.email,
            "CivilID": signupData.civilId,
            "AreaName": signupData.areaName,
            "WilayatName": signupData.wilayatName,
            "VillageName": signupData.villageName,
            "AreaId": signupData.area,
            "WilayatID": signupData.wilayat,
            "VillageID": signupData.village,
            "DeviceID": this.commonStorage.getItem("playerId")
        }
        this.headers = new Headers();
        this.headers.append("enctype", "multipart/form-data");
        this.headers.set('Accept', 'application/json');
        this.headers.append("content-type", "application/json");
        this.options = new RequestOptions({ headers: this.headers });
            return this.http.post(this.BASE_URL + 'api/AuthenticationService/RegisterUser?nLanguageID=' + this.commonStorage.localGet("langId") + '&nApplicationID=' + this.appData.APP_ID,JSON.stringify(data),this.options)
            .map((response: Response) => {
                try{
                    if(response.status == 404){
                        alert();
                    }
                    let res = response.json();
                    if(res["OperationResult"] == 1){
                        this.commonStorage.setItem("user",res);
                        return {success:true};
                    }else if(res["OperationResultMessage"]){
                        return {success:false,msg:res.OperationResultMessage};
                    }else{
                        return {success:false,msg:res.Message};
                    }
                    
                }catch(e){
                    console.log("Exception in AuthenticationService --> signup()",e)
                    return {success:false,body:{message:"Signup Failed try after sometime"}};
                }
            })
            .catch((err:any) => {        
                if(err instanceof Response) {
                    let body = err.json();
                    if (err.status === 500) {
                        return Observable.throw({status:500,body:{message:body.OperationResultMessage}});
                    }
                    else if (err.status === 400) {
                        console.log('sever error inside:  400', body);  // debug
                        return Observable.throw({status:400,body:{message:body.OperationResultMessage}});
                    }
                    else if (err.status === 404) {
                        return Observable.throw({status:404,body:{message:body.OperationResultMessage}});
                    }
                    else if (err.status === 409) {
                        return Observable.throw({status:409,body:{message:body.OperationResultMessage}});
                    }
                    else if (err.status === 406) {
                        return Observable.throw({status:406,body:{message:body.OperationResultMessage}});
                    }
                    else if (err.status === 422) {
                        console.log('sever error inside:  422', err.json());  // debug
                        return Observable.throw({status:422,body:{message:body.OperationResultMessage}});
                    }
                  return Observable.throw(err.json().error || 'backend server error');
                  // if you're using lite-server, use the following line
                  // instead of the line above:
                  //return Observable.throw(err.text() || 'backend server error');
                }
                return Observable.throw({status:404,message:'not found'});
            }); 
    } 
 
/**
 * validateOtp phone 
 */
    
    validatePhone(number:any): Observable<any> {
        let data = {
            "ApplicationID":this.appData.APP_ID,
        }
        this.headers = new Headers();
        this.headers.append("enctype", "multipart/form-data");
        this.headers.set('Accept', 'application/json');
        this.headers.append("content-type", "application/json");
        this.options = new RequestOptions({ headers: this.headers });
            return this.http.get(this.BASE_URL + 'api/AuthenticationService/ResendOTPNumber?sPhoneNumber=' + number.phone + "&nLanguageID=" + this.commonStorage.localGet("langId") + '&nApplicationID=' + this.appData.APP_ID,this.options)
            .map((response: Response) => {
                try{
                    let res = response.json();
                    if(res["OperationResult"] == 1){
                        this.commonStorage.setItem("userPhone",res);
                        return {success:true,msg:res.OperationResultMessage};
                    }else{
                        this.commonStorage.getItem("userPhone");
                        return {success:false};
                    }
                    
                }catch(e){
                    this.commonStorage.localRemove("user");
                    console.log("Exception in AuthenticationService --> signup()",e)
                    return {success:false,body:{message:"Signup Failed try after sometime"}};
                }
            }); 
    }   


    getUserDetailByPhone(phone):Observable<any>{
         return this.http.get(this.BASE_URL + 'api/AuthenticationService/GetUserDetailsByPhoneNumber?sPhoneNumber='+phone).map(res => res.json())
    }
    

/**
 * validateOtp code 
 */
    
    validateOtp(otp:any,phone:any): Observable<any> {
        let data = {
            "ApplicationID":this.appData.APP_ID,
        }
        this.headers = new Headers();
        this.headers.append("enctype", "multipart/form-data");
        this.headers.set('Accept', 'application/json');
        this.headers.append("content-type", "application/json");
        this.options = new RequestOptions({ headers: this.headers });
            return this.http.get(this.BASE_URL + 'api/AuthenticationService/ValidateOTPNumber?sPhoneNumber=' + phone + '&nOTPNumber=' + otp + "&nLanguageID=" + this.commonStorage.localGet("langId") + "&sDeviceID=" + this.commonStorage.getItem("playerId") + '&nApplicationID=' + this.appData.APP_ID, this.options)
            .map((response: Response) => {
                try{
                    let res = response.json();
                    if(res["ApiResponse"].OperationResult == 1){
                        this.commonStorage.localSet("user",res.TakamulUser);
                        return { success:true,msg:res.ApiResponse.OperationResultMessage };
                    }else{
                        this.commonStorage.localRemove("user");
                        return { success:false };
                    }
                    
                }catch(e){
                    this.commonStorage.localRemove("user");
                    console.log("Exception in AuthenticationService --> signup()",e)
                    return {success:false,body:{message:"Signup Failed try after sometime"}};
                }
            }); 
    }


/**
 * validateOtp code 
 */
    
    validateOtpFirst(otp:any,number:any): Observable<any> {
        let data = {
            "ApplicationID":this.appData.APP_ID,
        }
        this.headers = new Headers();
        this.headers.append("enctype", "multipart/form-data");
        this.headers.set('Accept', 'application/json');
        this.headers.append("content-type", "application/json");
        this.options = new RequestOptions({ headers: this.headers });
            return this.http.get(this.BASE_URL + 'api/AuthenticationService/ValidateOTPNumberReinstall?nOTPNumber=' + otp.otp + '&nMobileNo=' + number + "&nLanguageID=" + this.commonStorage.localGet("langId") + '&nApplicationID=' + this.appData.APP_ID,this.options)
            .map((response: Response) => {
                try{
                    let res = response.json();
                    if(res["OperationResult"] == 1){
                        // this.commonStorage.localSet("user",this.commonStorage.getItem("user"));
                        return {success:true};
                    }else{
                        // this.commonStorage.localRemove("user");
                        return {success:false};
                    }
                    
                }catch(e){
                    this.commonStorage.localRemove("user");
                    console.log("Exception in AuthenticationService --> signup()",e)
                    return {success:false,body:{message:"Signup Failed try after sometime"}};
                }
            }); 
    }
        

    logout(): void {
        // clear token remove user from local storage to log user out
        localStorage.removeItem('user');
    }

    isLoggedIn():boolean{
        var currentUser = JSON.parse(localStorage.getItem('user'));
        if(currentUser && currentUser.UserID){
            return true;
        }
        return false;
    }

    private setUser(currentUser){
//         var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return {
           name:currentUser.profile.first_name,
           ID:currentUser.user.ID,
        //    dob:currentUser.dob,
           mobileNo:currentUser.profile.mobile
        };
    }

    user():any{
        var currentUser = JSON.parse(localStorage.getItem('user'));
        return currentUser?currentUser:{};
    }

    userId():any{
         var currentUser = JSON.parse(localStorage.getItem('user'));
        if(currentUser){
            return currentUser.UserID;
        }
    }
    
    updateUserAuth(data:any){
        let name =  data.first_name;
        let mobile =  data.mobile;
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        currentUser.user.mobileNo = mobile;
        currentUser.user.name = name;

       // store ID and auth token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify({ ID: currentUser.user.ID, token: this.token, userFull: currentUser.userFull,user: currentUser.user}));
        // return true to indicate successful login
       return data;
    }

    forgotPassword(data){
        return this.http.post(this.BASE_URL + 'api/forgot_password.json?', JSON.stringify({ "user" : data }), this.options)
        .map((response: Response) => {
            try{
                let result = response.json()
                console.log("signup response --> authentication page", result)
                if (result.success) {
                    // return true to indicate successful
                    return result;
                } else {
                    // return false to indicate failed 
                    return result;
                }
            }catch(e){
                console.log("Exception in AuthenticationService --> forgotPassword()",e)
                return {success:false,body:{message:"Signup Failed try after sometime"}};
            }
        }); 
    }
}
