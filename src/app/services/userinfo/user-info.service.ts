import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from 'src/app/models/UserInfo';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private db: AngularFirestore) { }

  addNewUserInfo(userId: string, info: UserInfo): Promise<void> {
    return this.db.collection(environment.userDatabase).doc(userId).set(info.getData());
  }
}
