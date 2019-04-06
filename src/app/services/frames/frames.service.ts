import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Frame } from 'src/app/models/Frame';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable, of } from 'rxjs';
import { tap, mapTo } from 'rxjs/operators';
import { FramesStore } from '../stores/framesstore.service';
import * as firebase from 'firebase';
import { FrameUserInfo } from 'src/app/models/FrameUserInfo';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { UserInfoStore } from '../stores/userinfostore.service';
import { UserFrames } from 'src/app/models/UserFrames';

@Injectable({
  providedIn: 'root'
})
export class FramesService {

  private frameDb: string;
  private frameUserSub: string;
  private userDb: string;
  constructor(private db: AngularFirestore, private authService: AuthenticationService,
    private frameStore: FramesStore, private userInfoStore: UserInfoStore) {
    this.frameDb = environment.frameDatabase;
    this.frameUserSub = environment.frameUserSub;
    this.userDb = environment.userDatabase;
   }

   get currentState(): Observable<Frame[]> { return this.frameStore.frames$; }

  add(title: string, description: string): Observable<void> {
    const batch = this.db.firestore.batch();
    const frameId = this.db.createId();
    const frameRef = this.db.firestore.collection(this.frameDb);

    const newFrameRef = frameRef.doc(frameId);
    const newFrameUserRef = frameRef.doc(`${frameId}/${this.frameUserSub}/${frameId}`);
    const userRef = this.db.firestore.collection(this.userDb).doc(this.authService.currentUser.uid);
    const frame = new Frame(frameId, title, description, new Date());
    const frameUserInfo: FrameUserInfo = {};
    frameUserInfo[this.authService.currentUser.uid] = {
      permissions: [],
      role: 'owner'
    };

    batch.update(userRef, { frame: 'what' });
    batch.set(newFrameUserRef, frameUserInfo);
    batch.set(newFrameRef, frame.getData());
    return from(batch.commit()).pipe(
      tap(() => {
        this.frameStore.add(new ClientFrame(frame, frameUserInfo));
        const userFrame: UserFrames = {
          [frame.id]: {
            name: frame.title,
            role: 'owner'
          }
        };
        this.userInfoStore.addFrame(userFrame);
      })
    );
  }

  getAll(): Observable<void> {
    // return this.db.collection(this.dbName, ref => ref.where('createdBy', '==', this.authService.currentUser.uid)).get().pipe(
    //   tap((docs: firebase.firestore.QuerySnapshot) => {
    //     const framesList = [];
    //     docs.forEach(doc => {
    //       const data = doc.data();
    //       framesList.push(new Frame(doc.id, data.title, data.description, data.createdDate, data.createdBy, data.endDate,
    //         data.imagePaths, data.imageIds));
    //     });
    //     this.store.addMultiple(framesList);
    //   }),
    //   mapTo(null)
    // );
    return of();
  }

  // clear(): void {
  //   this.store.clear();
  // }

  // get(id: string): Observable<Frame> {
  //   return this.store.get(id);
  // }

  // addImage(frame: Frame, imageId: string, imagePath: string): Observable<void> {
  //   return from(this.db.collection(this.dbName).doc(frame.id).update({
  //     imageIds: firebase.firestore.FieldValue.arrayUnion(imageId),
  //     imagePaths: firebase.firestore.FieldValue.arrayUnion(imagePath)
  //   })).pipe(
  //     tap(() => {
  //       this.store.addImage(frame, imageId, imagePath);
  //     }),
  //     mapTo(null)
  //   );
  // }
}
