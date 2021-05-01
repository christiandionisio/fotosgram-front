import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/interfaces';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  token: string = null;
  private usuario: Usuario = {};

  constructor(private http: HttpClient,
              private storage: Storage,
              private navCtrl: NavController) {

    this.init();
  }


  async init() {
    await this.storage.create();
  }

    login(email: string, password: string) {

      const data = {email, password};

      return new Promise(resolve => {

        this.http.post(`${URL}/user/login`, data)
          .subscribe(resp => {

            if (resp['ok']) {
              this.guardarToken(resp['token']);
              resolve(true);
            } else {
              this.token = null;
              this.storage.clear();
              resolve(false);
            }
          });
      });

    }

    getUsuario() {

      if (!this.usuario._id) {
        this.validaToken();
      }
      return {...this.usuario};

    }

    async guardarToken(token: string) {

      this.token = token;
      await this.storage.set('token', token);

    }

    registro(usuario: Usuario) {

      return new Promise(resolve => {

        this.http.post(`${URL}/user/create`, usuario)
          .subscribe(resp => {

            console.log(resp);

            if (resp['ok']) {
              this.guardarToken(resp['token']);
              resolve(true);
            } else {
              this.token = null;
              this.storage.clear();
              resolve(false);
            }

          });

      });

    }

    async cargarToken() {

      this.token = await this.storage.get('token') || null;

    }

    async validaToken(): Promise<boolean> {

      await this.cargarToken();

      if (!this.token) {
        this.navCtrl.navigateRoot('/login');
        return Promise.resolve(false);
      }

      return new Promise<boolean>(resolve => {

        const headers = new HttpHeaders({
          'x-token': this.token
        });

        this.http.get(`${URL}/user/`, {headers})
          .subscribe(resp => {
            if (resp['ok']) {
              this.usuario = resp['usuario'];
              resolve(true);
            } else {
              this.navCtrl.navigateRoot('/login');
              resolve(false);
            }
          });

      });

    }

    actualizarUsuario(usuario: Usuario) {

      const headers = new HttpHeaders({
        'x-token': this.token
      });

      return new Promise(resolve => {

        this.http.post(`${URL}/user/update`, usuario, {headers})
          .subscribe(resp => {
            if (resp['ok']) {
              this.guardarToken(resp['token']);
              resolve(true);
;            } else {
              resolve(false);
            }
          });
      });


    }

}
