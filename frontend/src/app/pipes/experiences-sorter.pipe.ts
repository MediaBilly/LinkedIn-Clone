import { Pipe, PipeTransform } from '@angular/core';
import { Experience } from '../models/experience.model';

@Pipe({
  name: 'experiencesSorter'
})
export class ExperiencesSorterPipe implements PipeTransform {

  transform(exps: Experience[]): Experience[] {
    if (exps) {
      return exps.sort((a, b) => {
        const ta = new Date(a.startDate).getTime();
        const tb = new Date(b.startDate).getTime();
        return tb - ta;
      });
    } else {
      return [];
    }
  }

}
