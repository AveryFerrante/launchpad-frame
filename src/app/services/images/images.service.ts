import { Injectable } from '@angular/core';
import { ImagesStore } from '../stores/imagesstore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication.service';
import { Image } from '../../models/Image';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  dbName = environment.imageDatabase;
  constructor(private store: ImagesStore, private authService: AuthenticationService, private db: AngularFirestore) { }

  add(path: string, frameIds: string[]): Observable<Image> {
    const imageId = this.db.createId();
    const image = new Image(imageId, new Date(), path, this.authService.currentUser.uid, frameIds);
    return from(this.db.collection(this.dbName).doc(imageId).set(image.getData())).pipe(
      tap(() => this.store.add(image)),
      mapTo(image)
    );
  }
}
