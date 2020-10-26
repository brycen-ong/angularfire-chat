import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;

  constructor(
    private _afAuth: AngularFireAuth,
    private _afStore: AngularFirestore,
    private _router: Router
  ) {
    this.user$ = this._afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this._afStore.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  getUserInfo(){
    return this._afAuth.authState.pipe(
      switchMap(user => {
        if (user){
          return this._afStore.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signIn(value){
    return this._afAuth.signInWithEmailAndPassword(value.email, value.password)
      .then(data => {
        this._router.navigate(['/home']);
      });
  }

  signUp(value){
    return this._afAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then(data => {
        this._afStore.collection('users').doc(data.user.uid).set({
          email: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
          displayName: value.displayName,
          occupation: value.occupation,
          age: value.age,
          uid: ''
        }).then(info => this.updateUserInfo(data.user.uid));
      }, err => console.log(err));
  }

  async signOut(){
    if (this._afAuth.currentUser){
      return this._afAuth.signOut().then(data => {
        console.log(data);
      });
    }
  }

  resetPassword(value){
    return this._afAuth.sendPasswordResetEmail(value.email);
  }

  userState(){
    return new Promise<any>((resolve, reject) => {
      const promise = this._afAuth.onAuthStateChanged(user => {
        if (user){
          resolve('User Logged In');
        } else {
          reject('No User Logged In');
        }
      });
    });
  }

  updateUserInfo(uid){
    const userRef: AngularFirestoreDocument<any> = this._afStore.doc(`users/${uid}`);

    const data = {
      uid
    };

    return userRef.set(data, { merge: true });
  }

}
