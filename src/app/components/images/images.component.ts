import { TokenService } from 'src/app/services/token.service';
import { UsersService } from './../../services/users.service';
import { FileUploader } from 'ng2-file-upload';
import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

const URL = 'http://localhost:3000/api/socialconnect/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {

  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });

  selectedFile: any;
  user: any;
  images = [];
  socket: any;

  constructor(private userServices: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
   }

  ngOnInit() {
    this.user = this.tokenService.GetPayload();
    this.GetUser();
    this.socket.on('refreshPage', () => {
      this.GetUser();
    });
  }

  GetUser() {
    this.userServices.GetUserById(this.user._id).subscribe(data => {
      this.images = data.result.images;
      console.log('IMgs', this.images);
    });
  }

  onFileSelected(event) {
    const file: File = event[0];

    this.ReadAsBase64(file).then(result => {
       this.selectedFile = result;
    }).catch(err => console.log(err));
  }

  Upload() {
    if (this.selectedFile) {
      this.userServices.AddImage(this.selectedFile).subscribe(data => {
        this.socket.emit('refresh', {});
        const filePath = <HTMLInputElement>document.getElementById('filePath');
        filePath.value = '';
      },
      err => console.log(err));
    }
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

  SetPrfofileImage(image) {
    this.userServices.SetDefaultImage(image.imgId, image.imgVersion).subscribe(data => {
      this.socket.emit('refresh', {});
    }, err => {
      console.log(err);
    });
  }

}
