import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const endMonthYearValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const endYear = control.get('endYear');
    const endMonth = control.get('endMonth');

    if (endMonth?.value && !endYear?.value) {
        return { endMonthButNotYear: true };
    }

    return null;
}