import { AngularFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment'; 
import { UserInfo } from 'src/app/models/UserInfo';
import { Username } from 'src/app/models/Username';

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
}
