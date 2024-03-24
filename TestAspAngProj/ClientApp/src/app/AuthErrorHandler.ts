import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(error: any): void {
        const router = this.injector.get(Router);
        if(error instanceof HttpErrorResponse) {
            const httpError: HttpErrorResponse = error;

            if(httpError.status === 401 || httpError.status === 403) {
                router.navigate(['/login']);
            }
        }
    }
}