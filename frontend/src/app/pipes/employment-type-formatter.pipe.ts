import { Pipe, PipeTransform } from '@angular/core';
import { EmploymentType } from '../enums/employment-type.enum';

@Pipe({
  name: 'employmentTypeFormatter'
})
export class EmploymentTypeFormatterPipe implements PipeTransform {

  transform(value: string): string {
    let ret: string = ''; 
    Object.entries(EmploymentType).forEach(([key, val]) => {
      if (val.toString() === value) {
        ret = key;
      }
    });
    return ret;
  }

}
