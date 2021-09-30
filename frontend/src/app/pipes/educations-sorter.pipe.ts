import { Pipe, PipeTransform } from '@angular/core';
import { Education } from '../models/education.model';

@Pipe({
  name: 'educationsSorter'
})
export class EducationsSorterPipe implements PipeTransform {

  transform(edus: Education[]): Education[] {
    if (edus) {
      return edus.sort((a, b) => {
        const ta = a.startDate ? new Date(a.startDate).getTime() : 0;
        const tb = b.startDate ? new Date(b.startDate).getTime() : 0;
        return tb - ta;
      });
    } else {
      return [];
    }
  }

}
