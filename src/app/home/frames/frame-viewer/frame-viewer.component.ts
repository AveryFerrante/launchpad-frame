import { Component, OnInit, HostBinding } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { switchMap, concatMap, tap } from 'rxjs/operators';
import { Frame } from 'src/app/models/Frame';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { ImagesService } from 'src/app/services/images/images.service';
import { Image } from 'src/app/models/Image';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit {

  constructor(private framesService: FramesService, private route: ActivatedRoute,
    private storage: AngularFireStorage, private authService: AuthenticationService,
    private imagesService: ImagesService) { }

  frames$ = this.framesService.currentState;
  frame: Frame;
  @HostBinding('class.flex-grow-1') setTrue() { return true; }
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.framesService.get(params.get('id')))
    ).subscribe((f: Frame) => this.frame = f);
  }

  onFilesAdded(files: File[]) {
    for (const f of files) {
      const fileName = `${new Date().toJSON()}_${f.name}`;
      const metaData = {
        cacheControl: `public,max-age=${environment.pictureCache}`
      };
      const uploadTask = this.storage.storage.ref(`images/${this.authService.currentUser.uid}`).child(fileName).put(f, metaData);
      uploadTask.on('state_changed',
        (snapshot) => { console.log('Upload progress: ', (snapshot.bytesTransferred / snapshot.totalBytes) * 100, '%'); },
        (error) => console.log('Upload error occur, WHAT DO?'),
        () => {
          from(uploadTask.snapshot.ref.getDownloadURL()).pipe(
            concatMap((url: string) => this.imagesService.add(url, [this.frame.id])),
            concatMap((image: Image) => this.framesService.addImage(this.frame.id, image.id, image.path))
          ).subscribe({ complete: () => console.log('Completed image upload and added to frame') });
        }
      );
    }
  }

}
