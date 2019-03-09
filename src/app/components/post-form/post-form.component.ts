import { TokenService } from './../../services/token.service';
import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';

const URL = 'http://localhost:3000/api/socialconnect/upload-image';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  socket: any;
  selectedFile: any;
  postForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService, private tokenService: TokenService,
    private router: Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
  }

  init() {
     this.postForm = this.fb.group({
      post: ['', Validators.required]
     });
  }

  SubmitPost() {
    let body1;
    if (!this.selectedFile) {
      body1 = {
        post: this.postForm.value.post
      };
    } else {
      body1 = {
        post: this.postForm.value.post,
        image: this.selectedFile
      };
    }
    this.postService.addPost(body1).subscribe(data => {
      this.socket.emit('refresh', {});
      this.postForm.reset();
    }, err => {
      if (err.error.token === null) {
        this.tokenService.DeleteToken();
        this.router.navigate(['']);
      }
    });
  }

  OnFileSelected(event) {
    const file: File = event[0];

    this.ReadAsBase64(file).then(result => {
       this.selectedFile = result;
    }).catch(err => console.log(err));
  }

  ReadAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', (event) => {
        reject(event);
      });
      reader.readAsDataURL(file);
    });
    return fileValue;
  }

}
