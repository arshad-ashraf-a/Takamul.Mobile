import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'filter',
    pure: false
})

export class FilterPipe implements PipeTransform {
    transform(items: any[], field : string, value : string): any[] {  
        if (!items) return [];    
        let rtItems:any = items;
        try{
            rtItems = items.filter(it => it[field].toLowerCase().indexOf(value.toLowerCase()) > -1 );
        }finally{
            return rtItems;
        }
        
        
    }
}