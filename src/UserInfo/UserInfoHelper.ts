import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { UserInfo } from 'src/app/models/UserInfo';
import { Username } from 'src/app/models/Username';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class UserInfoHelper {
    private db: AngularFirestore;
    private userInfoCollection: string;
    private usernameCollection: string;

    constructor(db: AngularFirestore) {
        this.db = db;
        this.userInfoCollection = environment.userDatabase;
        this.usernameCollection = environment.usernameDatabase;
    }

    public newUserInfoBatch(batch: firebase.firestore.WriteBatch, userId: string, data: UserInfo) {
        const ref = this.db.collection(this.userInfoCollection).doc(userId).ref;
        batch.set(ref, data.getData());
    }

    public newUsernameBatch(batch: firebase.firestore.WriteBatch, data: Username) {
        const ref = this.db.collection(this.usernameCollection).doc(this.db.createId()).ref;
        batch.set(ref, data.getData());
    }

    public searchUsername(username: string) {
        username = username.toLowerCase().trim();
        return from(this.db.collection(this.usernameCollection, (ref) => ref.where('usernametrimmed', '==', username).limit(1)).get().pipe(
            map((val: firebase.firestore.QuerySnapshot) => {
                if (val.empty) {
                    return null;
                } else if (val.docs[0].exists) {
                    const data = val.docs[0].data();
                    return new Username(data.username, data.userid);
                } else {
                    return null;
                }
            })
        ));
    }

    public getUserInfo(userId: string): Observable<UserInfo> {
        return from(this.db.collection(this.userInfoCollection).doc(userId).get().pipe(
            map((response: firebase.firestore.DocumentSnapshot) => {
                try {
                    const data = response.data();
                    return new UserInfo(data.username, data.firstName, data.lastName, data.email, data.frames);
                } catch {
                    throw new Error('Userinfo does not exist for signed in user');
                }
            })
        ));
    }
}
