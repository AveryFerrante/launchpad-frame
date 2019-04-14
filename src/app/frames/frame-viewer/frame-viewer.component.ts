import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, fromEvent } from 'rxjs';
import { catchError, switchMap, tap, filter, first } from 'rxjs/operators';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ClientFrame } from '../../models/client-side/ClientFrame';
import { Errors } from '../../models/Errors';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit {

  constructor(private framesService: FramesService, private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any) { }

  elem: HTMLElement;
  frame$: Observable<ClientFrame> = null;
  frameImageUrls: string[] = [];
  frameNotFound = false;
  showSlideshow = false;
  @HostBinding('class') classes = 'h-100 d-flex flex-column';
  ngOnInit() {
    this.elem = document.documentElement;
    this.frame$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.framesService.getFrameData(params.get('id')).pipe(
        tap((cf: ClientFrame) => {
          this.frameImageUrls = [];
          for (const img of cf.images) {
            this.frameImageUrls.push(img.downloadPath);
          }
        }),
        catchError((error: Error) => {
          if (error.message === Errors.InvalidFrameId) {
            this.frameNotFound = true;
            this.frame$ = null;
          } else {
            console.log(error.message);
          }
          return of(null);
        })
      )),
    );
  }

  onViewFrame() {
    document.body.requestPointerLock();
    document.addEventListener('fullscreenchange', (e) => console.log(e));
    document.addEventListener('webkitfullscreenchange', (e) => console.log(e));
    document.addEventListener('mozfullscreenchange', (e) => console.log(e));
    document.addEventListener('MSFullscreenChange', (e) => console.log(e));
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    }
    // } else if (this.elem.mozRequestFullScreen) {
    //   /* Firefox */
    //   this.elem.mozRequestFullScreen();
    // } else if (this.elem.webkitRequestFullscreen) {
    //   /* Chrome, Safari and Opera */
    //   this.elem.webkitRequestFullscreen();
    // } else if (this.elem.msRequestFullscreen) {
    //   /* IE/Edge */
    //   this.elem.msRequestFullscreen();
    // }
    this.showSlideshow = true;
  }

  onFullscreenExit(slideNumber: number) {
    document.exitPointerLock();
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    }
    // else if (this.document.mozCancelFullScreen) {
    //   /* Firefox */
    //   this.document.mozCancelFullScreen();
    // } else if (this.document.webkitExitFullscreen) {
    //   /* Chrome, Safari and Opera */
    //   this.document.webkitExitFullscreen();
    // } else if (this.document.msExitFullscreen) {
    //   /* IE/Edge */
    //   this.document.msExitFullscreen();
    // }
    this.showSlideshow = false;
  }
}
