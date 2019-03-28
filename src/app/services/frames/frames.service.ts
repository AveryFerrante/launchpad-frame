import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Frame } from 'src/app/models/Frame';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FramesService {

  private dbName: string;
  constructor(private db: AngularFirestore, private authService: AuthenticationService) {
    this.dbName = environment.frameDatabase;
   }

  add(title: string, description: string): Observable<Frame> {
    const frameId = this.db.createId();
    const frame = new Frame(frameId, title, description, new Date(), this.authService.currentUser.uid, null);
    return from(this.db.collection(this.dbName).doc(frameId).set(frame.getData())).pipe(
      map(() => {
        return frame;
      })
    );
  }
}
