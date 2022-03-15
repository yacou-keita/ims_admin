import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'dateFilter'
})
export class DateFilterPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(value: any): any {
    if (!value) {
      return '';
    }
    //format = format || 'short';
    return value && typeof(value) === 'object' ? this.datePipe.transform(value, 'dd/mm/yyyy') : '';


  }

}