import { UtilProvider } from './util-provider'
import { CommonStorage } from './common-storage';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the DateService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DateService {
  constructor(private commonStorage : CommonStorage,private util:UtilProvider) {}
    addDate(num:number,isReturn:boolean = false):Observable<any>{
        console.log("addDate ---->",);
        
        let selDate = this.commonStorage.getItem("travelDate");
        let onwardDate = this.commonStorage.getItem("travelDate");
        let returnDate = this.commonStorage.getItem("travelDateReturn");
        if(isReturn){
          selDate = this.commonStorage.getItem("travelDateReturn");
        }
        selDate = this.getNextPrevDate(selDate,num);
        
        if(isReturn){
            this.commonStorage.setItem("travelDateReturn",selDate);
        }else{
            if(this.comparedate(selDate,returnDate)) {
                let selDate2 = this.getNextPrevDate(selDate,1);
                this.commonStorage.setItem("travelDateReturn",selDate2);
            }
            this.commonStorage.setItem("travelDate",selDate);
        }
        return new Observable(observer => {
            observer.next(true);
        });
    }

    isLeapYear(year:number)
    {
      return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }

    getToday():any{
        let dt = new Date();
        let today  = {
          day:dt.getDate(),
          month:dt.getMonth()+1,
          year:dt.getFullYear(), 
          dayName: this.util.getDayName(dt.getDay() + 1),
          monthName: this.util.getMonthName(dt.getMonth() + 1),
          formattedDate: this.preZero(dt.getDate()) + "-" + this.preZero(dt.getMonth()+1) + "-" + dt.getFullYear()
        }
        return today;
    }

    getNextPrevDate(selDate:any,num:number) {
        let dt = new Date(selDate.year, Number(selDate.month) - 1, Number(selDate.day));
        dt.setDate(dt.getDate() + num);
        return selDate = {
            day: dt.getDate(),
            month: dt.getMonth() + 1,
            year: dt.getFullYear(),
            dayName: this.util.getDayName(dt.getDay() + 1),
            monthName: this.util.getMonthName(dt.getMonth() + 1),
            formattedDate: this.preZero(dt.getDate()) + "-" + this.preZero(dt.getMonth() + 1) + "-" + dt.getFullYear()
        }
    }

    getTomorrow():any{
        let dt = new Date();
        dt.setDate(dt.getDate() + 1);
        let tomorrow  = {
          day:dt.getDate(),
          month:dt.getMonth()+1,
          year:dt.getFullYear(), 
          dayName: this.util.getDayName(dt.getDay() + 1),
          monthName: this.util.getMonthName(dt.getMonth() + 1),
          formattedDate: this.preZero(dt.getDate()) + "-" + this.preZero(dt.getMonth()+1) + "-" + dt.getFullYear()
        }
        return tomorrow;
    }
    comparedate(date,returnDate) {
      return (new Date(date.year,date.month,date.day) >= new Date(returnDate.year,returnDate.month,returnDate.day));
    }
    getDaysInMonth(month,year) {
        return new Date(year, month, 0).getDate();
    }

     preZero(val):string {
        // Prepend zero if smaller than 10
        return val < '10' ? '0' + val : val;
    }

    isPast(d:number,m:number,y:number):boolean{
        let today = new Date();
        today.setHours(0,0,0,0);
        
        let dt = new Date(y,m-1,d-1)
        if(dt < today){
            return true;
        }
        return false;
    }

    
    isPastDate(date, format='dd/mm/yyyy'):boolean{
        let today = new Date();
        today.setHours(0,0,0,0);
        let d=0,m=0,y=0;

        if(format=="dd/mm/yyyy"){
            d = +date.substr(0,2);
            m = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="mm/dd/yyyy"){
            m = +date.substr(0,2);
            d = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="yyyy/mm/dd"){
            y = +date.substr(0,4);
            m = +date.substr(5,2);
            d = +date.substr(8,2);
        }
        
        let dt = new Date(y,m-1,d-1)
        if(dt < today){
            return true;
        }
        return false;
    }


    getDayFromDate(date:string,format="dd/mm/yyyy"):string{
        let d,m,y;

        if(format=="dd/mm/yyyy"){
            d = date.substr(0,2);
        }else  if(format=="mm/dd/yyyy"){
            d = date.substr(3,2);
        }else  if(format=="yyyy/mm/dd"){
            d = date.substr(8,2);
        }
        return d;
    }

    getDayNameFromDate(date:string,format="dd/mm/yyyy",type="full"):string{
        let d=0,m=0,y=0;

        if(format=="dd/mm/yyyy"){
            d = +date.substr(0,2);
            m = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="mm/dd/yyyy"){
            m = +date.substr(0,2);
            d = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="yyyy/mm/dd"){
            y = +date.substr(0,4);
            m = +date.substr(5,2);
            d = +date.substr(8,2);
        }

        let dt = new Date(y,m-1,d)
        let day = dt.getDay();
        
        return this.getDayname(day,type);
    }

    getDayname(day,type="half"){
        let dayName:string;
        switch(day){
            case 0:
                dayName = type=='half'?'sunday':"sunday_full";
                break;
            case 1:
                dayName = type=='half'?'monday':"monday_full";
                break;
            case 2:
                dayName = type=='half'?'tuesday':"tuesday_full";
                break;
            case 3:
                dayName = type=='half'?'wednesday':"wednesday_full";
                break;
            case 4:
                dayName = type=='half'?'thursday':"thursday_full";
                break;
            case 5:
                dayName = type=='half'?'friday':"friday_full";
                break;
            case 6:
                dayName = type=='half'?'saturday':"saturday_full";
                break;
            default:
                dayName = type=='Sun'?'sunday':"sunday_full";
                break;
            
        }
        return dayName;
    }

    getMonthNameFromDate(date:string,format="dd/mm/yyyy",type="half"):string{
        let d=0,m=0,y=0;

        if(format=="dd/mm/yyyy"){
            d = +date.substr(0,2);
            m = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="mm/dd/yyyy"){
            m = +date.substr(0,2);
            d = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="yyyy/mm/dd"){
            y = +date.substr(0,4);
            m = +date.substr(5,2);
            d = +date.substr(8,2);
        }

        
        return this.getMonthName(m-1,type);
    }


    getMonthName(month,type='half'){
        let monthName:string;
        switch(month){
            case 0:
                monthName = type=='half'?'jan_half':'jan';
                break;
            case 1:
                monthName = type=='half'?'feb_half':'feb';
                break;
            case 2:
                monthName = type=='half'?'mar_half':'mar';
                break;
            case 3:
                monthName = type=='half'?'apr_half':'apr';
                break;
            case 4:
                monthName = type=='half'?'may_half':'may';
                break;
            case 5:
                monthName = type=='half'?'jun_half':'Jun';
                break;
            case 6:
                monthName = type=='half'?'jul_half':'jul';
                break;
            case 7:
                monthName = type=='half'?'aug_half':'aug';
                break;
            case 8:
                monthName = type=='half'?'sep_half':'sep';
                break;
            case 9:
                monthName = type=='half'?'oct_half':'oct';
                break;
            case 10:
                monthName = type=='half'?'nov_half':'nov';
                break;
            case 11:
                monthName = type=='half'?'dec_half':'dec';
                break;
            default:
                monthName = type=='half'?'jan_half':'jan';
                break;
            
        }
        return monthName;
    }

     changeDateFormat(date:string,fromFormat="mm/dd/yyyy",toFormat="dd/mm/yyyy"){
        let d=0,m=0,y=0;

        if(fromFormat=="dd/mm/yyyy" || fromFormat=="dd-mm-yyyy"){
            d = +date.substr(0,2);
            m = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(fromFormat=="mm/dd/yyyy" || fromFormat=="mm-dd-yyyy"){
            m = +date.substr(0,2);
            d = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(fromFormat=="yyyy/mm/dd" || fromFormat=="yyyy-mm-dd"){
            y = +date.substr(0,4);
            m = +date.substr(5,2);
            d = +date.substr(8,2);
        }

        toFormat = toFormat.replace(/yyyy/g,this.preZero(y));
        toFormat = toFormat.replace(/mm/g,this.preZero(m));
        toFormat = toFormat.replace(/dd/g,this.preZero(d));
        return toFormat;
     }
      changeDateFormatMonth(date:string,fromFormat="mm/dd/yyyy",type="half",toFormat='dd-mm-yyyy'){
        let d=0,m=0,y=0;

        if(fromFormat=="dd/mm/yyyy" || fromFormat=="dd-mm-yyyy"){
            d = +date.substr(0,2);
            m = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(fromFormat=="mm/dd/yyyy" || fromFormat=="mm-dd-yyyy"){
            m = +date.substr(0,2);
            d = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(fromFormat=="yyyy/mm/dd" || fromFormat=="yyyy-mm-dd"){
            y = +date.substr(0,4);
            m = +date.substr(5,2);
            d = +date.substr(8,2);
        }
        toFormat = toFormat.replace(/yyyy/g,this.preZero(y));
        toFormat = toFormat.replace(/mm/g,this.util.tranlateInstant(this.getMonthName(m-1,'half')));
        toFormat = toFormat.replace(/dd/g,this.preZero(d));
        return toFormat;
     }

     getDate(date:string,toFormat:string):string{
        if(!toFormat){
            return date.slice(0,10);
        }else{
            let d=0,m=0,y=0;
            date = date.slice(0,10);
            y = +date.substr(0,4);
            m = +date.substr(5,2);
            d = +date.substr(8,2);
            toFormat = toFormat.replace(/yyyy/g,this.preZero(y));
            toFormat = toFormat.replace(/mm/g,this.preZero(m));
            toFormat = toFormat.replace(/dd/g,this.preZero(d));
            return toFormat;
        }
     }

     getTime(date:string):string{
        let time =  date.substr(11,8);
        let hourEnd = time.indexOf(":");
        let H = +time.substr(0, hourEnd);
        let h = H % 12 || 12;
        let ampm = H < 12 ? "AM" : "PM";
        time = this.preZero(h) + time.substr(hourEnd, 3) + " " + ampm;
        return time;
     }

     getAge(dob,format='dd/mm/yyyy'){
         let d=0,m=0,y=0;
        
        if(format=="dd/mm/yyyy" || format=="dd-mm-yyyy"){
            d = +dob.substr(0,2);
            m = +dob.substr(3,2);
            y = +dob.substr(6,4);
        }else  if(format=="mm/dd/yyyy" || format=="mm-dd-yyyy"){
            m = +dob.substr(0,2);
            d = +dob.substr(3,2);
            y = +dob.substr(6,4);
        }else  if(format=="yyyy/mm/dd" || format=="yyyy-mm-dd"){
            y = +dob.substr(0,4);
            m = +dob.substr(5,2);
            d = +dob.substr(8,2);
        }
        let today = new Date();
        let birthDate = new Date(y,m-1,d);
        let age = today.getFullYear() - birthDate.getFullYear();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
     }

     headerDate(date,format='dd/mm/yyyy'){
        let d=0,m=0,y=0;
        if(format=="dd/mm/yyyy" || format=="dd-mm-yyyy"){
            d = +date.substr(0,2);
            m = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="mm/dd/yyyy" || format=="mm-dd-yyyy"){
            m = +date.substr(0,2);
            d = +date.substr(3,2);
            y = +date.substr(6,4);
        }else  if(format=="yyyy/mm/dd" || format=="yyyy-mm-dd"){
            y = +date.substr(0,4);
            m = +date.substr(5,2);
            d = +date.substr(8,2);
        }


        let dt = new Date(y,m-1,d)
        let day = dt.getDay();
        
        let dayName = this.getDayname(day);
        let dayDate = this.preZero(d);
        let monthName = this.getMonthName(m-1);
        let year = dt.getFullYear();
        return dayName + ' ' + dayDate + ' ' + monthName + ' ' + year;

     }
     
     ampm(time):string{
        let appFeatureStatus = this.commonStorage.getItem("metaData").appFeatureStatus   // this.metaData.appFeatureStatus
        let time24Format:any;
        if(appFeatureStatus){
            time24Format = appFeatureStatus.allow_24_hrs_time;
        }
        if(time24Format){
            if(time < "12:00"){
                return time + "AM";
            }
            return time + "PM";
        }
        return "";
     }

     daysInMonth(month,year) {
        return new Date(year, month, 0).getDate();
    }
}
