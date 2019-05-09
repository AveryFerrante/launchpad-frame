import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { forkJoin, from, Observable, of, TimeoutError } from 'rxjs';
import { last, map, mergeMap, tap, mapTo } from 'rxjs/operators';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { Frame } from 'src/app/models/Frame';
import { FrameImage } from 'src/app/models/FrameImage';
import { constructFrameUserInfo, FrameUserInfo } from 'src/app/models/FrameUserInfo';
import { ImageFrame } from 'src/app/models/ImageFrame';
import { constructUserFrame } from 'src/app/models/UserFrames';
import { environment } from '../../../environments/environment';
import { Image } from '../../models/Image';
import { AuthenticationService } from '../authentication/authentication.service';
import { ImagesService } from '../images/images.service';
import { FramesStore } from '../stores/framesstore.service';
import { UserInfoService } from '../../../UserInfo/user-info.service';
import { NotifierService } from 'angular-notifier';
import { Username } from 'src/app/models/Username';
import * as firebase from 'firebase/app';
import { _getComponentHostLElementNode } from '@angular/core/src/render3/instructions';

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
    private userInfoService: UserInfoService, private storage: AngularFireStorage,
    private imagesService: ImagesService, private notifierService: NotifierService) {
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
    return from(batch.commit()).pipe(
      tap(() => this.userInfoService.addFrame(constructUserFrame(frame.id, title, 'owner'))),
      mapTo(frame.id)
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

  getFrameData(frameId: string): Observable<ClientFrame> {
    if (this.frameStore.exists(frameId)) {
      return this.frameStore.getFrameWatcher(frameId);
    } else {
      return this.fetchFrameData(frameId);
    }
  }

  uploadImageToFrame(file: File, frameId: string): AngularFireUploadTask {
    const fileName = `${new Date().toJSON()}_${file.name}`;
    const metaData = {
      cacheControl: `public,max-age=${environment.pictureCache}`
    };
    const ref = this.storage.ref(`images/${this.authService.currentUser.uid}/${fileName}`);
    const task = ref.put(file, metaData);
    task.snapshotChanges().pipe(
      last(),
      mergeMap((snapShot: firebase.storage.UploadTaskSnapshot) => from(snapShot.ref.getDownloadURL())),
      mergeMap((dl: string) => this.newImageWorkflow(frameId, dl))
    ).subscribe();
    return task;
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
          console.log(frameUserInfo);
          for (const key in frameUserInfo.users) {
            console.log(frameUserInfo.users[key].joined);
            frameUserInfo.users[key].joined = new Date(frameUserInfo.users[key].joined.seconds * 1000);
            console.log(frameUserInfo.users[key].joined);
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
    const frameUserRef = this.db.firestore.collection(this.frameDb).doc(`${frameId}/${this.frameUserSub}/${frameId}`);

    const userInfo = this.userInfoService.currentState;
    const frameImage = new FrameImage(frameImageSubRef.id, downloadPath, imageId,
      this.authService.currentUser.uid, new Date(), `${userInfo.username}`);
    const image = new Image(imageId, new Date(), frameImage.downloadPath, this.authService.currentUser.uid);
    const imageFrame = new ImageFrame(new Date());
    batch.set(frameImageSubRef, frameImage.getData());
    batch.set(imageRef, image.getData());
    batch.set(imageFrameRef, imageFrame.getData());
    batch.update(frameUserRef, {
      [`users.${this.authService.currentUser.uid}.pictureCount`]: firebase.firestore.FieldValue.increment(1)
    });
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
    // Decrement image
    const frameUserRef = this.db.firestore.collection(this.frameDb).doc(`${frameId}/${this.frameUserSub}/${frameId}`);
    batch.update(frameUserRef, {
      [`users.${userId}.pictureCount`]: firebase.firestore.FieldValue.increment(-1)
    });
    return from(batch.commit()).pipe(
      tap(() => this.frameStore.removeImage(frameId, frameImageId)),
      tap(() => this.frameStore.alterImageCount(frameId, userId, -1))
    );
  }
}
