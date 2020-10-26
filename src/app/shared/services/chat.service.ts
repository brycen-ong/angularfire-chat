import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private _afStore: AngularFirestore,
    private _authService: AuthService,
    private _router: Router
  ) { }

  get(chatId) {
    return this._afStore
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() as {} };
        })
      );
  }

  getUserChats() {
    return this._authService.user$.pipe(
      switchMap(user => {
        return this._afStore
          .collection('chats', ref => ref.where('uid', '==', user.uid))
          .snapshotChanges()
          .pipe(
            map(actions => {
              return actions.map(a => {
                const data: Object = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data};
              });
            })
          );
      })
    );
  }

  async create() {
    const { uid } = await this._authService.getUser();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this._afStore.collection('chats').add(data);

    return this._router.navigate(['chat', docRef.id]);
  }

  async sendMessage(chatId, content){
    const { uid } = await this._authService.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this._afStore.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  joinUsers(chat$: Observable<any>){
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        const userDocs = uids.map(u =>
          this._afStore.doc(`users/${u}`).valueChanges()
          );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid]};
        });

        return chat;
      })
    )
  }
}
