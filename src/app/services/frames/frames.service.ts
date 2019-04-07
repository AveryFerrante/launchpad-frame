import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Frame } from 'src/app/models/Frame';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable, of, forkJoin } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';
import { FramesStore } from '../stores/framesstore.service';
import * as firebase from 'firebase';
import { FrameUserInfo, constructFrameUserInfo } from 'src/app/models/FrameUserInfo';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { UserInfoStore } from '../stores/userinfostore.service';
import { constructUserFrame } from 'src/app/models/UserFrames';
import { UserInfoService } from '../userinfo/user-info.service';
import { Errors } from 'src/app/models/Errors';

@Injectable({
  providedIn: 'root'
})
export class FramesService {

  private frameDb: string;
  private frameUserSub: string;
  constructor(private db: AngularFirestore, private authService: AuthenticationService, private frameStore: FramesStore,
    private userInfoStore: UserInfoStore, private userInfoService: UserInfoService) {
    this.frameDb = environment.frameDatabase;
    this.frameUserSub = environment.frameUserSub;
   }

   get currentState(): Observable<Frame[]> { return this.frameStore.frames$; }

  add(title: string, description: string) {
    const frameId = this.db.createId();
    const frame = new Frame(frameId, title, description, new Date());
    const userFrame = constructUserFrame(frameId, title, 'owner');
    const frameUserInfo: FrameUserInfo = constructFrameUserInfo(this.authService.currentUser.uid, [], 'owner');

    return from(this.db.firestore.runTransaction((t) => {
      return forkJoin(
        this.userInfoService.getAddFrameTransaction(t, userFrame),
        this.getAddFrameTransaction(t, frame),
        this.getAddFrameUserTransaction(t, frame.id, frameUserInfo)
      ).toPromise();
    })).pipe(
      tap(() => this.userInfoStore.addFrame(userFrame)),
      tap(() => this.frameStore.add(new ClientFrame(frame)))
    );
  }

  getAddFrameTransaction(t: firebase.firestore.Transaction, frame: Frame) {
    const docRef = this.db.firestore.collection(this.frameDb).doc(frame.id);
    return of(t.set(docRef, frame.getData()));
  }

  getAddFrameUserTransaction(t: firebase.firestore.Transaction, frameId: string, frameUserInfo: FrameUserInfo) {
    const docRef = this.db.firestore.collection(this.frameDb).doc(`${frameId}/${this.frameUserSub}/${frameId}`);
    return of(t.set(docRef, frameUserInfo));
  }

  getFrameData(frameId: string): Observable<ClientFrame> {
    if (this.frameStore.exists(frameId)) {
      return this.frameStore.get(frameId);
    } else {
      return this.fetchFrameData(frameId);
    }
  }

  /***
   * Fetches frame and image data from the DB. This data
   * is then automatically inserted into the store.
   */
  private fetchFrameData(frameId: string): Observable<ClientFrame> {
    return this.db.collection(this.frameDb).doc(frameId).get().pipe(
      map((doc: firebase.firestore.DocumentSnapshot) => {
        if (doc.exists) {
          const data = doc.data();
          const frame = new Frame(doc.id, data.title, data.description, data.createdDate);
          return new ClientFrame(frame);
        } else {
          throw new Error(Errors.InvalidFrameId);
        }
      }),
      tap((val: ClientFrame) => this.frameStore.add(val)),
      mergeMap(() => this.frameStore.get(frameId))
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
