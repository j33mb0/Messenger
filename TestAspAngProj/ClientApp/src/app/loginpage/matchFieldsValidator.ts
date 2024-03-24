import { AbstractControl, AsyncValidatorFn, ValidationErrors, AsyncValidator } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

// Асинхронный валидатор
export function matchFieldsAsyncValidator(field1: string, field2: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value1 = control.get(field1)!.value;
    const value2 = control.get(field2)!.value;

    if (value1 !== value2) {
      // Возвращаем ошибку, если значения не совпадают
      return of({ matchFields: true });
    }

    // Если значения совпадают, возвращаем null
    return of(null);
  };
}