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

  getPasswordByUrl(url: string): Observable<OpenAccess> {
    return this.getByUrl(url).pipe(
        map((result) => {
          if (!result.empty) {
            const data = result.docs[0].data();
            const retVal: OpenAccess = {
              id: result.docs[0].id,
              enddate: data['enddate'],
              frameId: data['frameid'],
            };
            return retVal;
          } else {
            return null;
          }
        })
      );
  }

  addNewAnonymousUser(openAccessId: string): Observable<string> {
    const wtf = { test: 'thing' };
    return from(this.db.collection(`${this.openAccessDb}/${openAccessId}/${this.activeTokenSub}`).add(wtf)).pipe(
      map(doc => doc.id)
    );
  }

  private getByUrl(url: string): Observable<firebase.firestore.QuerySnapshot> {
    return this.db.collection(this.openAccessDb, q => q.where('url', '==', url).where('enddate', '>', new Date())
      .limit(1)).get();
  }

}
