import { Adapter } from './adapter';
import { CommonStorage } from './common-storage';
import { AppData } from './appdata';
import { UtilProvider } from './util-provider';

import {Injectable} from '@angular/core';
import { Http , Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';
import { Observable } from "rxjs/Observable";
// import {Location} from '@angular/common';
import { Authentication } from './authentication';

@Injectable()
export class ApiFactory {

    private GET_CITY_DESTINATION_PAIRS:string;
    headers:any;
    options:any;
    platformName:string;
    API_URL = "api/";
    constructor(
        private http: Http,
        private authenticate:Authentication,
        private util:UtilProvider,
        private appData:AppData,
        private commonStorage:CommonStorage,
     ) {
        // this.location = location;
        this.platformName = this.util.platformName();

    }

    
    
    
    getHeaders(){
        if(this.authenticate.isLoggedIn()){
            this.headers = new Headers();
            this.headers.append('HTTP_AUTH_TOKEN', this.authenticate.token);
            // this.headers.append('Origin', "http://gds-chile.staging.ticketsimply.com");
        }else{ 
            this.headers = new Headers();
        }
        return this.headers;
    }

    getUrl(uri): any {
        this.getHeaders();
        return this.http.get(uri)
        .timeout(75000);
    }

    postUrl(uri,data): any {
        this.headers = new Headers();
        this.headers.append("enctype", "multipart/form-data");
        this.headers.set('Accept', 'application/json');
        this.headers.append("content-type", "application/json");
        this.options = new RequestOptions({ headers: this.headers });
        return this.http.post(uri,data,this.options)
        .timeout(75000)
    }

    prepareApi(path:string):string{
      if(this.authenticate.isLoggedIn()){
        path =  path;
      }else{
        path =  path;
      }
      if(path.indexOf("?") > -1)
          return this.appData.BASE_URL + this.API_URL + path + "&nLanguageID=" + this.commonStorage.localGet("langId");
      else
          return this.appData.BASE_URL + this.API_URL + path + "?nLanguageID=" + this.commonStorage.localGet("langId");
    }
    
    prepareApi2(path):string{
    //   if(this.authenticate.isLoggedIn()){
    //     path =  path + "&ID=" + this.authenticate.user().ID + "&PW="  + this.authenticate.user().PW;
    //   }else{
    //     path =  path;
    //   }
      return this.appData.BASE_URL2 + path;
    }


    getApplicationDetail():Observable<any>{
         return this.getUrl(this.prepareApi("CommonService/GetApplicationDetails?nApplicationID="+this.appData.APP_ID)).map(res => res.json());
    }
    
    getUserDetail(id):Observable<any>{
         return this.getUrl(this.prepareApi("CommonService/GetUserDetails?nUserID="+id + '&nApplicationID=' + this.appData.APP_ID)).map(res => res.json());
    }
    
    getUserDetailByPhone(phone):Observable<any>{
         return this.getUrl(this.prepareApi("AuthenticationService/GetUserDetailsByPhoneNumber?sPhoneNumber="+phone + '&nApplicationID=' + this.appData.APP_ID)).map(res => res.json());
    }
    
    getEventList():Observable<any>{
         return this.getUrl(this.prepareApi("EventService/GetAllEvents?nApplicationID="+this.appData.APP_ID)).map(res => res.json());
    }
    
    
    getEventDetail(id):Observable<any>{
         return this.getUrl(this.prepareApi("EventService/GetEventDetails?nEventsID="+id + '&nApplicationID=' + this.appData.APP_ID)).map(res => res.json());
    }


    getNewsList():Observable<any>{
         return this.getUrl(this.prepareApi("NewsService/GetAllNews?nApplicationID="+this.appData.APP_ID)).map(res => res.json());
    }

    getNewsDetail(id):Observable<any>{
         return this.getUrl(this.prepareApi("NewsService/GetNewsDetails?nNewsID="+id + '&nApplicationID=' + this.appData.APP_ID)).map(res => res.json());
    }


    getTicketList(id):Observable<any>{
         return this.getUrl(this.prepareApi("TicketService/GetAllTickets?nApplicationID="+this.appData.APP_ID + "&nUserID=" + id)).map(res => res.json());
    }

    createTicketChat(id,data):Observable<any>{
         return this.postUrl(this.prepareApi("TicketService/CreateTicket?nUserID=" + id + '&nApplicationID=' + this.appData.APP_ID),data).map(res => res.json());
    }
    getTicketChat(id):Observable<any>{
         return this.getUrl(this.prepareApi("TicketService/GetTicketChats?nTicketID=" + id + '&nApplicationID=' + this.appData.APP_ID)).map(res => res.json());
    }

    getTicketChatLast(id,cId):Observable<any>{
         return this.getUrl(this.prepareApi("TicketService/GetMoreTicketChats?nTicketID=" + id + '&nLastTicketChatID=' + cId + '&nApplicationID=' + this.appData.APP_ID)).map(res => res.json());
    }

    postTicketChat(data){
         return this.postUrl(this.prepareApi("TicketService/PostTicketChat"), data).map(res => res.json());
    }
    

    getAllArea(){
        return this.getUrl(this.prepareApi("CommonService/GetAllArea")).map(res => res.json());
    }
    getAllWilayat(aCode){
        return this.getUrl(this.prepareApi("CommonService/GetAllWilayats?sAreaCode="+aCode)).map(res => res.json());
    }
    getAllVillages(aCode,wCode){
        return this.getUrl(this.prepareApi("CommonService/GetAllVillages?sAreaCode=" + aCode + "&sWilayatCode=" + wCode)).map(res => res.json());
    }
    getMemberInfo(){
        return this.getUrl(this.prepareApi("CommonService/GetMemberInfo?nApplicationID=1")).map(res => res.json());
    }

    resolve(ticketId,userId){
        return this.postUrl(this.prepareApi("TicketService/ResolveTicket?oTicketId=" + ticketId + "&oUserid=" + userId + '&nApplicationID=' + this.appData.APP_ID),{}).map(res => res.json());
    }

    deleteTicket(ticketId,userId){
        return this.postUrl(this.prepareApi("TicketService/DeleteTicket?oTicketId=" + ticketId + "&oUserid=" + userId + '&nApplicationID=' + this.appData.APP_ID),{}).map(res => res.json());
    }

    getHomeData(userId){
        return this.getUrl(this.prepareApi("CommonService/GetHomePageData?nApplicationID="+this.appData.APP_ID + "&nUserID=" + userId)).map(res => res.json());
    }
}