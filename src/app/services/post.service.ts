import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASEURL = 'http://localhost:3000/api/socialconnect';

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
