import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Url } from '../config/url';

// const BASEURL = 'https://social-connect-542be.firebaseapp.com/api/socialconnect';
 const BASEURL = 'mongodb+srv://admin-mihir:rastablasta1@cluster0-78ren.mongodb.net/api/socialconnect';
// const BASEURL = 'http://localhost:3000/api/socialconnect';
// const BASEURL = 'https://polar-lake-36384.herokuapp.com/api/socialconnect';
console.log('BASEURL', BASEURL);

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  SendMessage(senderId, receiverId, receiverName, message): Observable<any> {
    return this.http.post(`${BASEURL}/chat-messages/${senderId}/${receiverId}`, {
      receiverId,
      receiverName,
      message
    });
  }

  GetAllMessages(senderId, receiverId): Observable<any> {
    return this.http.get(`${BASEURL}/chat-messages/${senderId}/${receiverId}`);
  }

  MarkMessages(sender, receiver): Observable<any> {
    return this.http.get(`${BASEURL}/receiver-messages/${sender}/${receiver}`);
  }

  MarkAllMessages(): Observable<any> {
    return this.http.get(`${BASEURL}/mark-all-messages`);
  }
}
