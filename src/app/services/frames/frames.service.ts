import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Frame } from 'src/app/models/Frame';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable, of, forkJoin } from 'rxjs';
import { tap, map, mergeMap, merge } from 'rxjs/operators';
import { FramesStore } from '../stores/framesstore.service';
import * as firebase from 'firebase';
import { FrameUserInfo, constructFrameUserInfo } from 'src/app/models/FrameUserInfo';
import { ClientFrame } from 'src/app/models/client-side/ClientFrame';
import { UserInfoStore } from '../stores/userinfostore.service';
import { constructUserFrame } from 'src/app/models/UserFrames';
import { UserInfoService } from '../userinfo/user-info.service';
import { Errors } from 'src/app/models/Errors';
import { AngularFireStorage } from '@angular/fire/storage';
import { FrameImage } from 'src/app/models/FrameImage';
import { Image } from '../../models/Image';
import { ImagesService } from '../images/images.service';
import { ImageFrame } from 'src/app/models/ImageFrame';

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
    private imagesService: ImagesService) {
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

  uploadImageToFrame(file: File): firebase.storage.UploadTask {
    const fileName = `${new Date().toJSON()}_${file.name}`;
    const metaData = {
      cacheControl: `public,max-age=${environment.pictureCache}`
    };
    return this.storage.storage.ref(`images/${this.authService.currentUser.uid}`).child(fileName).put(file, metaData);
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
            frameImages.push(new FrameImage(subData.downloadPath, subData.imageId, subData.ownerId));
          }
          return new ClientFrame(frame, frameImages);
        }),
        tap((val: ClientFrame) => this.frameStore.add(val)),
        mergeMap(() => this.frameStore.getFrameWatcher(frameId))
      );
  }

  public newImageWorkflow(frameId: string, downloadPath: string): Observable<void> {
    const imageId = this.db.createId();
    const frameImage = new FrameImage(downloadPath, imageId, this.authService.currentUser.uid);
    const batch = this.db.firestore.batch();
    const frameImageSubRef = this.db.firestore.collection(this.frameDb)
      .doc(`${frameId}/${this.frameImageSub}/${this.db.createId()}`);
    const image = new Image(imageId, new Date(), frameImage.downloadPath, this.authService.currentUser.uid);
    const imageRef = this.db.firestore.collection(this.imageDb).doc(imageId);
    const imageFrameRef = this.db.firestore.collection(this.imageDb).doc(`${imageId}/${this.imageFrameSub}/${frameId}`);
    const imageFrame = new ImageFrame(new Date());
    batch.set(frameImageSubRef, frameImage.getData());
    batch.set(imageRef, image.getData());
    batch.set(imageFrameRef, imageFrame.getData());
    return from(batch.commit()).pipe(
      tap(() => this.frameStore.addImage(frameId, frameImage))
    );
  }
}
