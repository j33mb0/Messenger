import { HttpClient, HttpHeaders, HttpRequest, HttpInterceptor, HttpEvent, HttpHandler } from '@angular/common/http';
import { TOKEN_NAME } from './auth.service';
import { Observable } from 'rxjs';

const AUTH_PREFIX = 'Bearer';

export class AuthRequestOptions implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(TOKEN_NAME);
    const tokenHeader = AUTH_PREFIX + ' ' + token;
    if(token) {
      const modifiedReq = req.clone({
        setHeaders: {
          'Authorization' : tokenHeader
        }
      });
      return next.handle(modifiedReq);
    }
    return next.handle(req);
  }
  
}