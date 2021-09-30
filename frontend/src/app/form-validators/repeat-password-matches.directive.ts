import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const repeatPasswordMatchesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let newPassword = control.get('newPassword');
    if (!newPassword) {
        newPassword = control.get('password');
    }
    const repeatPassword = control.get('repeatPassword');

    return newPassword && repeatPassword && newPassword.value !== repeatPassword.value ? { passwordsDoNotMatch: true } : null;
}