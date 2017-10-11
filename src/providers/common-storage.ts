import {Injectable} from '@angular/core';

@Injectable()

export class CommonStorage{
    public requiredData:any = {};

    constructor() {}

    setItem(name,values){
        this.requiredData[name] = values;
    }
    getItem(name){
        return this.requiredData[name];
    }
    
    localSet(name,values){
        // if(typeof values == "string"){
        //     localStorage.setItem(name, values);
        //     return;
        // }
        localStorage.setItem(name,JSON.stringify(values));
    }
    localGet(name){
        return JSON.parse(localStorage.getItem(name));
        
    }
    localRemove(name){
        localStorage.removeItem(name);
    }
    localHas(name){
        return localStorage.hasOwnProperty(name);
    }
}