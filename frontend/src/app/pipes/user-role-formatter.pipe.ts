import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../models/user.model';

@Pipe({
  name: 'userRoleFormatter'
})
export class UserRoleFormatterPipe implements PipeTransform {

  transform(value: string): string {
    let ret: string = ''; 
    Object.entries(UserRole).forEach(([key, val]) => {
      if (val.toString() === value) {
        ret = key;
      }
    });
    return ret;
  }

}
