import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Url } from '../config/url';

// const BASEURL = 'https://social-connect-542be.firebaseapp.com/api/socialconnect';
 const BASEURL = 'mongodb+srv://admin-mihir:rastablasta1@cluster0-78ren.mongodb.net/api/socialconnect';
// const BASEURL = 'https://polar-lake-36384.herokuapp.com/api/socialconnect';
// const BASEURL = 'http://localhost:3000/api/socialconnect';

console.log('BASEURL', BASEURL);

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  addPost(body): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-post`, body);
  }

  getAllPost(): Observable<any> {
    return this.http.get(`${BASEURL}/posts`);
  }

  addLikePost(body): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-likepost`, body);
  }

  addComment(postId, comment): Observable<any> {
    return this.http.post(`${BASEURL}/post/add-comment`, {
      postId,
      comment
    });
  }

  getPost(id): Observable<any> {
    return this.http.get(`${BASEURL}/post/${id}`);
  }
}
