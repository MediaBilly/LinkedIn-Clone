import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const repeatPasswordMatchesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const repeatPassword = control.get('repeatPassword');

    return newPassword && repeatPassword && newPassword.value !== repeatPassword.value ? { passwordsDoNotMatch: true } : null;
}