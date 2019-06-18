import { DOCUMENT } from '@angular/common';
import { Component, HostBinding, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FramesService } from 'src/app/services/frames/frames.service';
import { ClientFrame } from '../../models/client-side/ClientFrame';
import { Errors } from '../../models/Errors';
import { UserInfo } from 'src/app/models/UserInfo';
import { FrameUserInfoMetadata } from 'src/app/models/FrameUserInfoMetadata';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Username } from 'src/app/models/Username';

@Component({
  selector: 'app-frame-viewer',
  templateUrl: './frame-viewer.component.html',
  styleUrls: ['./frame-viewer.component.css']
})
export class FrameViewerComponent implements OnInit, OnDestroy {

  constructor(private framesService: FramesService, private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document, private router: ActivatedRoute, private authService: AuthenticationService) { }

  elem: any;
  view = 'images';
  frameSubscription: Subscription;
  frame: ClientFrame = null;
  frameUsers: Username[] = [];
  frameImageUrls: string[] = [];
  frameNotFound = false;
  showSlideshow = false;
  slideshowFullscreen = false;
  userInfo$: Observable<UserInfo> = null;
  frameId: string;
  loading = true;
  private fsEventHandler: any = this.onFullscreenChange.bind(this);
  @HostBinding('class') classes = 'h-100 d-flex flex-column';
  ngOnInit() {
    this.elem = this.document.documentElement;
    this.initFrameObservable();
    this.document.addEventListener('fullscreenchange', this.fsEventHandler);
    this.document.addEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.addEventListener('webkitfullscreenchange', this.fsEventHandler);
    this.document.addEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.addEventListener('MSFullscreenChange', this.fsEventHandler);
  }

  private initFrameObservable() {
    this.frameSubscription = this.route.paramMap.pipe(
      tap((params: ParamMap) => {
        this.loading = true;
        this.frameId = params.get('id');
        this.userInfo$ = (this.router.snapshot.data['UserInfo'] as Observable<UserInfo>);
      }),
      switchMap(() => this.framesService.getFrameData(this.frameId).pipe(
        tap((cf: ClientFrame) => {
          this.frameImageUrls = [];
          this.frameUsers = [];
          for (const img of cf.images) {
            this.frameImageUrls.push(img.downloadPath);
          }
          this.frame = cf;
          this.loading = false;
        }),
        catchError((error: Error) => {
          if (error.message === Errors.InvalidFrameId) {
            this.frameNotFound = true;
            this.frame = null;
          }
          this.loading = false;
          return of(null);
        })
      )),
    ).subscribe();
  }

  changeView(view: string) {
    this.view = view;
  }

  setUpSlideshow() {
    const ss = this.document.querySelector('#slideshow');
    ss.removeChild(ss.firstChild); // Removes 'X' in upper right
    const tags = ss.getElementsByTagName('a');
    for (let i = 0; i < tags.length; i++) {
      tags.item(i).removeAttribute('href');
      tags.item(i).removeAttribute('title');
      tags.item(i).style.cursor = 'none';
      setTimeout(() => tags.item(i).style.backgroundSize = 'stretch', 500);
    }
  }

  onFullscreenChange() {
    if (this.showSlideshow === false) {
      this.showSlideshow = true;
      this.slideshowFullscreen = true;
      setTimeout(this.setUpSlideshow, 100); /* THIS IS NOT GOOD....FIND A WAY TO TIE INTO THE ELEMENT CREATION */
    } else {
      this.slideshowFullscreen = false;
      this.showSlideshow = false;
    }
  }

  onViewFrame() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) { /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) { /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  ngOnDestroy() {
    this.frameSubscription.unsubscribe();
    this.document.removeEventListener('fullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('webkitfullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('mozfullscreenchange', this.fsEventHandler);
    this.document.removeEventListener('MSFullscreenChange', this.fsEventHandler);
  }
}
