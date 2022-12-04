import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Url } from '../config/url';

//  const BASEURL = 'https://social-connect-542be.firebaseapp.com/api/socialconnect';
// const BASEURL = 'mongodb+srv://admin-mihir:b0lzakaleo@cluster0.78ren.mongodb.net/socialconnect';
// const BASEURL = 'https://polar-lake-36384.herokuapp.com/api/socialconnect';
const BASEURL = 'http://localhost:3000/api/socialconnect';

console.log('BASEURL', BASEURL);
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  registerUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/register`, body);
  }

  loginUser(body): Observable<any> {
    console.log('body', body);
    return this.http.post(`${BASEURL}/login`, body);
  }


}
