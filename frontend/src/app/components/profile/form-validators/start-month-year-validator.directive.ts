import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const startMonthYearValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startYear = control.get('startYear');
    const startMonth = control.get('startMonth');

    if (startMonth?.value && !startYear?.value) {
        return { startMonthButNotYear: true };
    }

    return null;
}