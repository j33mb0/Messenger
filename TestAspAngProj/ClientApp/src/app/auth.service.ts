import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { JwtHelperService} from '@auth0/angular-jwt';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl: string = 'https://localhost:7287/api/Auth/login';
  private registerUrl: string = 'https://localhost:7287/api/Auth/register';  
  private headers = new HttpHeaders({'Content-Type' : 'application/json'});
  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem(TOKEN_NAME);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = jwt_decode.jwtDecode(token);

    if(decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string | null): boolean {
    if(!token) {
        token = this.getToken();
    }
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date!.valueOf() > new Date().valueOf());

  }

  removeToken() {
    localStorage.removeItem(TOKEN_NAME);
  }

  login(name: string, pass: string): Observable<any> {
    const jsonData = {
      username: name,
      password: pass
    }
    return this.http.post(this.loginUrl, jsonData, { headers: this.headers });
  }
  register(name: string, pass: string): Observable<any> {
    const jsonData = {
      username: name,
      password: pass
    }
    return this.http.post(this.registerUrl, jsonData, { headers: this.headers});
  }
  getUserId(): number {
    const token = this.getToken();
    if(token && !this.isTokenExpired(token)) {
      const decodeToken = this.jwtHelper.decodeToken(token);
      return decodeToken.Id;
    }
    return 0;
  }
}
