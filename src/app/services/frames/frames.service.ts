import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Frame } from 'src/app/models/Frame';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class FramesService {

  constructor(private db: AngularFirestore, private authService: AuthenticationService) { }

  add(frame: Frame): Promise<void> {
    return this.db.collection(environment.frameDatabase).doc(this.authService.currentUser.uid).set(frame.getData());
  }
}
