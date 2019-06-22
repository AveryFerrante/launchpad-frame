import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, mapTo } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { OpenAccess } from 'src/app/models/client-side/OpenAccess';

@Injectable({
  providedIn: 'root'
})
export class OpenAccessService {

  private openAccessDb: string;
  private activeTokenSub: string;
  constructor(private db: AngularFirestore) {
    this.openAccessDb = environment.openAccessDatabase;
    this.activeTokenSub = environment.openAccessTokenSub;
  }

  active(frameId: string): Observable<boolean> {
    return this.db.collection(this.openAccessDb, q => q.where('frameid', '==', frameId).where('enddate', '<', new Date()).limit(1))
      .get().pipe(
        map((result) => !result.empty)
      );
  }

  getOpenAccessByUrl(url: string): Observable<OpenAccess> {
    return this.getByUrl(url).pipe(
        map((result) => {
          if (!result.empty) {
            const data = result.docs[0].data();
            const retVal: OpenAccess = {
              id: result.docs[0].id,
              enddate: data['enddate'],
              frameId: data['frameid'],
              frameName: data['frameName']
            };
            return retVal;
          } else {
            return null;
          }
        })
      );
  }

  private getByUrl(url: string): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection(this.openAccessDb, q => q.where('url', '==', url).where('enddate', '>', new Date())
      .limit(1)).get();
  }

}
