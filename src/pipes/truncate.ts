import { Pipe,PipeTransform } from "@angular/core";

@Pipe({
  name: "truncate",
  pure: false
})

export class TruncatePipe implements PipeTransform {
   transform(value: string, length: number, trail:string): string {
    let limit = length ? length : 10;
    trail = trail ? trail : '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
} 