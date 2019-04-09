import { Injectable } from '@angular/core';
import { ImagesStore } from '../stores/imagesstore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { Image } from '../../models/Image';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { ImageFrame } from 'src/app/models/ImageFrame';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private imageDb = environment.imageDatabase;
  private imageFrameSub = environment.imageFrameSub;
  constructor(private store: ImagesStore, private authService: AuthenticationService, private db: AngularFirestore) { }

  getAddImageTransaction(t: firebase.firestore.Transaction, downloadPath: string, imageId: string = null) {
    if (imageId === null) {
      imageId = this.db.createId();
    }
    const image = new Image(imageId, new Date(), downloadPath, this.authService.currentUser.uid);
    const docRef = this.db.firestore.collection(this.imageDb).doc(imageId);
    return of(t.set(docRef, image.getData()));
  }

  getAddImageFrameTransaction(t: firebase.firestore.Transaction, imageId: string, frameId: string) {
    const docRef = this.db.firestore.collection(this.imageDb).doc(`${imageId}/${this.imageFrameSub}/${frameId}`);
    const imageFrame = new ImageFrame(new Date());
    return of(t.set(docRef, imageFrame.getData()));
  }
}
