import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, NavController } from '@ionic/angular';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { Usuario } from '../../interfaces/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonSlides, {static: true}) slides: IonSlides;

  loginUser = {
    email: 'christian@gmail.com',
    password: '123456'
  }

  registerUser: Usuario = {
    email: 'test',
    password: '123456',
    nombre: 'Test',
    avatar: 'av-1.png'
  };

  constructor(private usuarioService: UsuarioService,
              private navCtrl: NavController,
              private uiService: UiServiceService) { }

  ngOnInit() {
    this.slides.lockSwipes(true);

  }

  async login(fLogin: NgForm) {

    if (fLogin.invalid) {
      return;
    }

    const valido = await this.usuarioService.login(this.loginUser.email, this.loginUser.password);

    if (valido) {
      //navegar al tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
    } else {
      //alerta usuario/contraseña incorrecto
      this.uiService.alertaInformativa('Usuario o contraseña no son correctos');
    }

  }

  async registro(fRegistro: NgForm) {

    if (fRegistro.invalid) {
      return;
    }

    const valido = await this.usuarioService.registro(this.registerUser);

    if (valido) {
      //navegar al tabs
      this.navCtrl.navigateRoot('/main/tabs/tab1', {animated: true});
    } else {
      //alerta usuario/contraseña incorrecto
      this.uiService.alertaInformativa('El correo electrónico ya existe');
    }
  }

  nextSlide(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  previousSlide(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

}
