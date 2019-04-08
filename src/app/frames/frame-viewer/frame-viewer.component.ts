import { Component, OnInit, HostBinding } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {  of } from 'rxjs';
import { ImagesService } from 'src/app/services/images/images.service';
import { ClientFrame } from '../../models/client-side/ClientFrame';
import { switchMap, catchError } from 'rxjs/operators';
import { Errors } from '../../models/Errors';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit {

  constructor(private framesService: FramesService, private route: ActivatedRoute,
    private storage: AngularFireStorage, private authService: AuthenticationService,
    private imagesService: ImagesService) { }

  frame: ClientFrame = null;
  frameNotFound = false;
  @HostBinding('class') classes = 'flex-grow-1 d-flex flex-column';
  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.framesService.getFrameData(params.get('id')).pipe(
        catchError((error: Error) => {
          if (error.message === Errors.InvalidFrameId) {
            this.frameNotFound = true;
            this.frame = null;
          } else {
            console.log(error.message);
          }
          return of();
        })
      )),
    ).subscribe((frame: ClientFrame) => { this.frame = frame; this.frameNotFound = false; });
  }

  // Must hard pass currentFrameId here since a user could switch to a new frame during uploading, causing a new frame id to propagate
  // onFilesAdded(files: File[], currentFrameId = this.id) {
  //   for (const file of files) {
  //     const fileName = `${new Date().toJSON()}_${file.name}`;
  //     const metaData = {
  //       cacheControl: `public,max-age=${environment.pictureCache}`
  //     };
  //     const uploadTask = this.storage.storage.ref(`images/${this.authService.currentUser.uid}`).child(fileName).put(file, metaData);
  //     uploadTask.on('state_changed',
  //       (snapshot) => { console.log('Upload progress: ', (snapshot.bytesTransferred / snapshot.totalBytes) * 100, '%'); },
  //       (error) => console.log('Upload error occur, WHAT DO?'),
  //       () => {
  //         const values$ = forkJoin(this.framesService.get(currentFrameId).pipe(take(1)),
  //                                  from(uploadTask.snapshot.ref.getDownloadURL())).pipe(
  //           switchMap((values: [Frame, string]) => forkJoin(of(values[0]), this.imagesService.add(values[1], [values[0].id]))),
  //           concatMap((values: [Frame, Image]) => this.framesService.addImage(values[0], values[1].id, values[1].path))
  //         ).subscribe({ complete: () => console.log('Completed image upload and added to frame') });
  //       }
  //     );
  //   }
  // }

}
