import { Component, OnInit, HostBinding } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { switchMap } from 'rxjs/operators';
import { Frame } from 'src/app/models/Frame';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit {

  constructor(private framesService: FramesService, private route: ActivatedRoute,
    private storage: AngularFireStorage, private authService: AuthenticationService) { }

  frames$ = this.framesService.currentState;
  frame: Frame;
  @HostBinding('class.flex-grow-1') setTrue() { return true; }
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.framesService.get(params.get('id')))
    ).subscribe((f: Frame) => this.frame = f);
  }

  onFilesAdded(files: File[]) {
    console.log(files);
    for (const f of files) {
      // const fileName = `${new Date().toJSON()}_${f.name}`;
      // this.storage.storage.ref(this.authService.currentUser.uid).child(fileName).put(f).then(resp => {
      //   console.log(resp);
      // });
      const a = new FormData();
      a.append('file', f);
      firebase.functions().httpsCallable('uploadFile')(a).then(resp => console.log(resp));
    }
  }

}
