import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  tempImages: string[] = [];
  cargandoGeo = false;

  post = {
    mensaje: '',
    coords: null,
    posicion: false
  }

  constructor(private postService: PostsService,
              private route: Router,
              private geolocation: Geolocation,
              private camera: Camera) {}

  async crearPost() {
    console.log(this.post);
    const creado = await this.postService.crearPost(this.post);

    this.post = {
      mensaje: '',
      coords: null,
      posicion: false
    };

    this.tempImages = [];

    this.route.navigateByUrl('/main/tabs/tab1');
  }

  async getGeo() {

    if (!this.post.posicion) {
      this.post.coords = null;
      return;
    }

    this.cargandoGeo = true;

    await this.geolocation.getCurrentPosition().then((resp) => {
      this.cargandoGeo = false;
      const coords = `${resp.coords.latitude},${resp.coords.longitude}`
      console.log(coords);
      this.post.coords = coords;

     }).catch((error) => {
       console.log('Error getting location', error);
       this.cargandoGeo = false;
     });

  }

  camara() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }

    this.procesarImagen(options);


  }

  libreria() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.procesarImagen(options);

  }

  procesarImagen(options: CameraOptions) {

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):

       const img = window.Ionic.WebView.convertFileSrc(imageData);
       console.log(img);

       this.postService.subirImagen(imageData);
       this.tempImages.push(img);

     }, (err) => {
      // Handle error
     });

  }
}
