import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Frame } from 'src/app/models/Frame';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable } from 'rxjs';
import { tap, map, mapTo, concatMap } from 'rxjs/operators';
import { FramesStore } from '../stores/framesstore.service';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FramesService {

  private dbName: string;
  constructor(private db: AngularFirestore, private authService: AuthenticationService, private store: FramesStore) {
    this.dbName = environment.frameDatabase;
   }

   get currentState(): Observable<Frame[]> { return this.store.frames$; }

  add(title: string, description: string): Observable<string> {
    const frameId = this.db.createId();
    const frame = new Frame(frameId, title, description, new Date(), this.authService.currentUser.uid, null);
    return from(this.db.collection(this.dbName).doc(frameId).set(frame.getData())).pipe(
      tap(() => this.store.add(frame)),
      map(() => frame.id)
    );
  }

  getAll(): Observable<void> {
    return this.db.collection(this.dbName, ref => ref.where('createdBy', '==', this.authService.currentUser.uid)).get().pipe(
      tap((docs: firebase.firestore.QuerySnapshot) => {
        const framesList = [];
        docs.forEach(doc => {
          const data = doc.data();
          framesList.push(new Frame(doc.id, data.title, data.description, data.createdDate, data.createdBy, data.endDate,
            data.imagePaths, data.imageIds));
        });
        this.store.addMultiple(framesList);
      }),
      mapTo(null)
    );
  }

  clear(): void {
    this.store.clear();
  }

  get(id: string): Observable<Frame> {
    return this.store.get(id);
  }

  addImage(frame: Frame, imageId: string, imagePath: string): Observable<void> {
    return from(this.db.collection(this.dbName).doc(frame.id).update({
      imageIds: firebase.firestore.FieldValue.arrayUnion(imageId),
      imagePaths: firebase.firestore.FieldValue.arrayUnion(imagePath)
    })).pipe(
      tap(() => {
        this.store.addImage(frame, imageId, imagePath);
      }),
      mapTo(null)
    );
  }
}
