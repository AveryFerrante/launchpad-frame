import { Component, OnInit, HostBinding } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import {  of } from 'rxjs';
import { ImagesService } from 'src/app/services/images/images.service';
import { ClientFrame } from '../../models/client-side/ClientFrame';
import { switchMap, catchError, tap } from 'rxjs/operators';
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
  frameId: string = null;
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
        }),
        tap(() => this.frameId = params.get('id'))
      )),
    ).subscribe((frame: ClientFrame) => { this.frame = frame; this.frameNotFound = false; });
  }
}
