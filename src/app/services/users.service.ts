import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const BASEURL = 'http://localhost:3000/api/socialconnect';

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

}
