import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Loading } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';
import * as firebase from 'firebase';

/**
 * Generated class for the EntrarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entrar',
  templateUrl: 'entrar.html',
})
export class EntrarPage {

	public loading1: Loading;

	userProfile: any = null;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private facebook: Facebook,
  	public toastCtrl: ToastController,
  	public loadingCtrl: LoadingController
  	) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntrarPage');
  }

  logout() {
    firebase.auth().signOut()
    .then(success => {
      console.log('Signed Out');
      this.userProfile = null;
      //this.removerPerfil();
    }, error => {
      console.error('Sign Out Error', error);
    });
  }

  facebookLogin(){
    this.loading1 = this.loadingCtrl.create({
      content: "Por favor espere...",
      spinner: 'bubbles',
    });
    this.loading1.present();

      this.facebook.login(['email']).then( (response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider
              .credential(response.authResponse.accessToken);

          firebase.auth().signInWithCredential(facebookCredential)
          .then((success) => {
          	this.loading1.dismiss();
          	this.presentToast("Conectado Correctamente", 3000);
              console.log("Firebase success Facebook");
              this.userProfile = success;
              console.log(this.userProfile)
          })
          .catch((error) => {
              this.loading1.dismiss();
              console.error("Firebase failure: " + error);
              this.presentToast("Error en el Login", 3000);
          });

      }).catch((error) => { 
        console.error(error);
        this.loading1.dismiss();
        this.presentToast("Error al conectar el login", 3000);
      });
  }

  presentToast(message: string, duration: number) {
      const toast = this.toastCtrl.create({
        message: message,
        duration: duration
      });
      toast.present();
    }

}
