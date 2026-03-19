import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = String(control.value ?? '');
  const isValid = /^[0-9+\-\s]{8,20}$/.test(value);
  return isValid ? null : { phone: true };
}
