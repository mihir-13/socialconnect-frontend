import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Url } from '../config/url';

// const BASEURL = 'https://social-connect-542be.firebaseapp.com/api/socialconnect';
// const BASEURL = 'mongodb+srv://admin-mihir:rastablasta1@cluster0-78ren.mongodb.net/api/socialconnect';
 const BASEURL = 'http://localhost:3000/api/socialconnect';
// const BASEURL = 'https://polar-lake-36384.herokuapp.com/api/socialconnect';



console.log('BASEURL', BASEURL);

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  GetAllUser(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  }

  GetUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}`);
  }

  GetUserByUsername(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  }

  FollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, {
      userFollowed
    });
  }

  UnFollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, {
      userFollowed
    });
  }

  MarkNotification(id, deleteValue?): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, {
      id,
      deleteValue
    });
  }

  MarkAllAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/mark-all`, {
      all: true
    });
  }

  AddImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      image
    });
  }

  SetDefaultImage(imageId, imageVersion): Observable<any> {
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVersion}`);
    // return this.http.get(`${BASEURL}/set-default-image?id=${imageId}?version=${imageVersion}`);
  }

  ProfileNotifications(id): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, {
      id
    });
  }

  ChangePAssword(body): Observable<any> {
    return this.http.post(`${BASEURL}/change-password`, body);
  }

}
