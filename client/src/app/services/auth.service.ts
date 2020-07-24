import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  
  login(email: String, password: String): Promise<any> {
    const data = {email: email, password: password};
    return this.http.post(environment.api_despacho_agua + 'login', JSON.stringify(data)).toPromise()
    .then( r =>
      r
    ).catch( error => {
      error;
    });
  }
  
  register(name: String, email: String): Promise<any> {
    const data = {name: name, email: email};
    return this.http.post(environment.api_despacho_agua + 'register', JSON.stringify(data)).toPromise()
    .then( r =>
      r
    ).catch( error => {
      error;
    });
  }

  password_recovery_request(email: String): Promise<any> {
    const data = {email: email};
    return this.http.post(environment.api_despacho_agua + 'password_recovery_request', JSON.stringify(data)).toPromise()
    .then( r =>
      r
    ).catch( error => {
      error;
    });
  }
  
  password_change(new_password: String): Promise<any> {
    const data = {new_password: new_password};
    const options = {headers: null};
    options.headers = new HttpHeaders({'api_token': sessionStorage.getItem('api_token')});
    return this.http.post(environment.api_despacho_agua + 'user/password_change', JSON.stringify(data), options).toPromise()
    .then( r =>
      r
    ).catch( error => {
      error;
    });
  }
}
