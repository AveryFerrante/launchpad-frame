import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import * as firebase from 'firebase';
import { forkJoin, from, Observable, of } from 'rxjs';
import { last, map, mergeMap, tap } from 'rxjs/operators';
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
import { UserInfoStore } from '../stores/userinfostore.service';
import { UserInfoService } from '../userinfo/user-info.service';
import { NotifierService } from 'angular-notifier';

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
    private userInfoStore: UserInfoStore, private userInfoService: UserInfoService, private storage: AngularFireStorage,
    private imagesService: ImagesService, private notifierService: NotifierService) {
    this.frameDb = environment.frameDatabase;
    this.frameUserSub = environment.frameUserSub;
    this.frameImageSub = environment.frameImageSub;
   }

   get currentState(): Observable<Frame[]> { return this.frameStore.frames$; }

  add(title: string, description: string) {
    const frameId = this.db.createId();
    const frame = new Frame(frameId, title, description, new Date());
    const userFrame = constructUserFrame(frameId, title, 'owner');
    const userInfo = this.userInfoStore.getCurrentSnapshot();
    const frameUserInfo: FrameUserInfo = constructFrameUserInfo(this.authService.currentUser.uid, [], 'owner',
      userInfo.firstName, userInfo.lastName);

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

  getAddFrameImageTransaction(t: firebase.firestore.Transaction, frameId: string, frameImage: FrameImage) {
    const docRef = this.db.firestore.collection(this.frameDb).doc(`${frameId}/${this.frameImageSub}/${this.db.createId()}`);
    return of(t.set(docRef, frameImage.getData()));
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
      this.db.collection(`${this.frameDb}/${frameId}/${this.frameImageSub}`).get()).pipe(
        map((val: [firebase.firestore.DocumentSnapshot, firebase.firestore.QuerySnapshot]) => {
          const data = val[0].data();
          const frame = new Frame(val[0].id, data.title, data.description, data.createdDate);
          const frameImages: FrameImage[] = [];
          for (const doc of val[1].docs) {
            const subData = doc.data();
            const dateAdded = new Date(subData.dateAdded.seconds * 1000);
            frameImages.push(new FrameImage(doc.id, subData.downloadPath, subData.imageId, subData.ownerId,
              dateAdded, subData.addedBy));
          }
          return new ClientFrame(frame, frameImages);
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

    const userInfo = this.userInfoStore.getCurrentSnapshot();
    const frameImage = new FrameImage(frameImageSubRef.id, downloadPath, imageId,
      this.authService.currentUser.uid, new Date(), `${userInfo.firstName} ${userInfo.lastName}`);
    const image = new Image(imageId, new Date(), frameImage.downloadPath, this.authService.currentUser.uid);
    const imageFrame = new ImageFrame(new Date());
    batch.set(frameImageSubRef, frameImage.getData());
    batch.set(imageRef, image.getData());
    batch.set(imageFrameRef, imageFrame.getData());
    return from(batch.commit()).pipe(
      tap(() => this.frameStore.addImage(frameId, frameImage))
    );
  }

  public removeImageWorkflow(frameId: string, imageId: string, frameImageId: string): Observable<void> {
    const batch = this.db.firestore.batch();
    // Remove from frame images
    batch.delete(this.db.collection(`${this.frameDb}/${frameId}/${this.frameImageSub}`).doc(`${frameImageId}`).ref);
    // Remove from image frames
    batch.delete(this.db.collection(`${this.imageDb}/${imageId}/${this.imageFrameSub}`).doc(`${frameId}`).ref);
    return from(batch.commit()).pipe(
      tap(() => this.frameStore.removeImage(frameId, frameImageId))
    );
  }
}
