import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import { forkJoin, from, Observable } from 'rxjs';
import { last, map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { Frame } from 'src/app/models/Frame';
import { FrameImage } from 'src/app/models/FrameImage';
import { constructFrameUserInfo, FrameUserInfo, constructFrameUserInfoPending } from 'src/app/models/FrameUserInfo';
import { ImageFrame } from 'src/app/models/ImageFrame';
import { constructUserFrame } from 'src/app/models/UserFrames';
import { Username } from 'src/app/models/Username';
import { environment } from '../../../environments/environment';
import { UserInfoService } from '../../../UserInfo/user-info.service';
import { Image } from '../../models/Image';
import { AuthenticationService } from '../authentication/authentication.service';
import { FramesStore } from '../stores/framesstore.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class FramesService {

  private frameDb: string;
  private frameUserSub: string;
  private frameImageSub: string;
  private imageDb = environment.imageDatabase;
  private imageFrameSub = environment.imageFrameSub;
  constructor(private db: AngularFirestore, private authService: AuthenticationService, private frameStore: FramesStore,
    private userInfoService: UserInfoService, private storage: AngularFireStorage, private notificationService: NotificationsService) {
    this.frameDb = environment.frameDatabase;
    this.frameUserSub = environment.frameUserSub;
    this.frameImageSub = environment.frameImageSub;
   }

   get currentState(): Observable<Frame[]> { return this.frameStore.frames$; }

  add(title: string, description: string, usersToAdd: Username[] = []): Observable<string> {
    const frameId = this.db.createId();
    const frame = new Frame(frameId, title, description, new Date(), this.userInfoService.currentState.username);
    const userFrame = constructUserFrame(frameId, title, 'owner');
    const userInfo = this.userInfoService.currentState;
    const frameUserInfo: FrameUserInfo = constructFrameUserInfo(this.authService.currentUser.uid, [], 'owner',
      userInfo.username, usersToAdd);

    const batch = this.db.firestore.batch();
    this.userInfoService.addFrameBatch(batch, userFrame);
    this.addFrameBatch(batch, frame);
    this.addFrameUserBatch(batch, frame.id, frameUserInfo);
    this.notificationService.addNewFrameNotificationsBatch(batch, frameId, frame.title,
      usersToAdd.map((username: Username) => username.userid));
    return from(batch.commit()).pipe(
        tap(() => this.userInfoService.addFrame(userFrame)),
        tap(() => this.frameStore.add(new ClientFrame(frame, [], frameUserInfo, true))),
        mapTo(frame.id)
      );
  }

  inviteUsers(frameId: string, frameTitle: string, usersToAdd: Username[]) {
    const batch = this.db.firestore.batch();
    const pendingUsers = {};
    usersToAdd.forEach(user => {
      pendingUsers[user.userid] = constructFrameUserInfoPending(user.username, this.authService.currentUser.uid,
        this.userInfoService.currentState.username);
    });
    this.notificationService.addNewFrameNotificationsBatch(batch, frameId, frameTitle,
      usersToAdd.map((username: Username) => username.userid));
    this.addPendingUsersBatch(batch, frameId, pendingUsers);
    return from(batch.commit()).pipe(
      tap(() => this.frameStore.updatePendingUsers(frameId, this.authService.currentUser.uid,
        this.userInfoService.currentState.username, usersToAdd))
    );
  }

  addFrameBatch(b: firebase.firestore.WriteBatch, frame: Frame) {
    const docRef = this.db.firestore.collection(this.frameDb).doc(frame.id);
    b.set(docRef, frame.getData());
  }

  addFrameUserBatch(b: firebase.firestore.WriteBatch, frameId: string, frameUserInfo: FrameUserInfo) {
    const docRef = this.db.firestore.collection(this.frameDb).doc(`${frameId}/${this.frameUserSub}/${frameId}`);
    b.set(docRef, frameUserInfo);
  }

  addPendingUsersBatch(b: firebase.firestore.WriteBatch, frameId: string, pendingUsers: Object) {
    const docRef = this.db.firestore.collection(this.frameDb).doc(`${frameId}/${this.frameUserSub}/${frameId}`);
    const updates = {
      pendingUsers
    };
    b.set(docRef, updates, { merge: true });
  }

  getFrameData(frameId: string): Observable<ClientFrame> {
    if (this.frameStore.exists(frameId)) {
      return this.frameStore.getFrameWatcher(frameId);
    } else {
      return this.fetchFrameData(frameId);
    }
  }

  uplaodAnonymousImageToFrame(file: File, frameId: string) {
    const task = this.uploadImageToStorage(file);
    task.snapshotChanges().pipe(
      last(),
      mergeMap((snapShot: firebase.storage.UploadTaskSnapshot) => from(snapShot.ref.getDownloadURL())),
      mergeMap((dl: string) => {
        const frameImage = new FrameImage('', dl, 'N/A',
            'N/A', new Date(), 'anonymous uploader');
        return from(this.db.firestore.collection(`${this.frameDb}/${frameId}/${this.frameImageSub}`)
          .add(frameImage.getData()));
      })
    ).subscribe();
    return task;
  }

  uploadImageToFrame(file: File, frameId: string): AngularFireUploadTask {
    const task = this.uploadImageToStorage(file);
    task.snapshotChanges().pipe(
      last(),
      mergeMap((snapShot: firebase.storage.UploadTaskSnapshot) => from(snapShot.ref.getDownloadURL())),
      mergeMap((dl: string) => this.newImageWorkflow(frameId, dl))
    ).subscribe(); // This will self complete
    return task;
  }

  private uploadImageToStorage(file: File): AngularFireUploadTask {
    const fileName = `${new Date().toJSON()}_${file.name}`;
    const metaData = {
      cacheControl: `public,max-age=${environment.pictureCache}`
    };
    const ref = this.storage.ref(`images/anonymous/${fileName}`);
    return ref.put(file, metaData);
  }

  clearFrames() {
    this.frameStore.clearFrames();
  }

  /*
   * Fetches frame and image data from the DB. This data
   * is then automatically inserted into the store.
   */
  private fetchFrameData(frameId: string): Observable<ClientFrame> {
    return forkJoin(this.db.collection(this.frameDb).doc(frameId).get(),
      this.db.collection(`${this.frameDb}/${frameId}/${this.frameImageSub}`).get(),
      this.db.collection(`${this.frameDb}/${frameId}/${this.frameUserSub}`).get()).pipe(
        map((val: [firebase.firestore.DocumentSnapshot, firebase.firestore.QuerySnapshot, firebase.firestore.QuerySnapshot]) => {
          const data = val[0].data();
          const frame = new Frame(val[0].id, data.title, data.description, data.createdDate, data.createdBy);
          const frameImages: FrameImage[] = [];
          for (const doc of val[1].docs) {
            const subData = doc.data();
            const dateAdded = new Date(subData.dateAdded.seconds * 1000);
            frameImages.push(new FrameImage(doc.id, subData.downloadPath, subData.imageId, subData.ownerId,
              dateAdded, subData.addedBy));
          }

          const frameUserInfo = (val[2].docs[0].data());
          for (const key in frameUserInfo.users) {
            frameUserInfo.users[key].joined = new Date(frameUserInfo.users[key].joined.seconds * 1000);
          }
          return new ClientFrame(frame, frameImages, frameUserInfo as FrameUserInfo);
        }),
        tap((val: ClientFrame) => this.frameStore.add(val)),
        mergeMap(() => this.frameStore.getFrameWatcher(frameId))
      );
  }

  private newImageWorkflow(frameId: string, downloadPath: string): Observable<void> {
    const imageId = this.db.createId();
    const batch = this.db.firestore.batch();
    const frameImageSubRef = this.db.firestore.collection(`${this.frameDb}/${frameId}/${this.frameImageSub}`)
      .doc();
    const imageRef = this.db.firestore.collection(this.imageDb).doc(imageId);
    const imageFrameRef = this.db.firestore.collection(this.imageDb).doc(`${imageId}/${this.imageFrameSub}/${frameId}`);

    const userInfo = this.userInfoService.currentState;
    const frameImage = new FrameImage(frameImageSubRef.id, downloadPath, imageId,
      this.authService.currentUser.uid, new Date(), `${userInfo.username}`);
    const image = new Image(imageId, new Date(), frameImage.downloadPath, this.authService.currentUser.uid);
    const imageFrame = new ImageFrame(new Date());
    batch.set(frameImageSubRef, frameImage.getData());
    batch.set(imageRef, image.getData());
    batch.set(imageFrameRef, imageFrame.getData());
    return from(batch.commit()).pipe(
      tap(() => this.frameStore.addImage(frameId, frameImage)),
      tap(() => this.frameStore.alterImageCount(frameId, this.authService.currentUser.uid, 1))
    );
  }

  public removeImageWorkflow(frameId: string, imageId: string, frameImageId: string, userId: string): Observable<void> {
    const batch = this.db.firestore.batch();
    // Remove from frame images
    batch.delete(this.db.collection(`${this.frameDb}/${frameId}/${this.frameImageSub}`).doc(`${frameImageId}`).ref);
    // Remove from image frames
    batch.delete(this.db.collection(`${this.imageDb}/${imageId}/${this.imageFrameSub}`).doc(`${frameId}`).ref);
    return from(batch.commit()).pipe(
      tap(() => this.frameStore.removeImage(frameId, frameImageId)),
      tap(() => this.frameStore.alterImageCount(frameId, userId, -1))
    );
  }
}
