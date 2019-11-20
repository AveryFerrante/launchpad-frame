import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { switchMap, take, tap, catchError, filter, mergeMap } from 'rxjs/operators';
import { OpenAccess } from 'src/app/models/client-side/OpenAccess';
import { OpenAccessService } from 'src/app/services/open-access/open-access.service';
import { from, of } from 'rxjs';
import { FramesService } from 'src/app/services/frames/frames.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  password: string;
  errorMessage: string = null;
  loading = false;
  token: string = null;
  openAccess: OpenAccess = null;
  constructor(private activatedRoute: ActivatedRoute, private openAccessService: OpenAccessService, private frameService: FramesService) { }

  ngOnInit() {
    this.loading = true;
    this.activatedRoute.paramMap.pipe(
      mergeMap(params => {
        return this.openAccessService.getOpenAccessByUrl(params.get('id')).pipe(
          tap(() => this.loading = false),
          this.checkValidUrl()
        );
      })
    ).pipe(take(1)).subscribe();
  }

  createAccessToken(password: string) {
    this.loading = true;
    const func = firebase.functions().httpsCallable('createOpenAccessToken');
    // This completes automatically since it is from a promise.
    from(func({ password: password, openAccessId: this.openAccess.id, frameId: this.openAccess.frameId })).pipe(
      this.checkError(),
      tap(() => this.loading = false),
      filter(val => val !== null),
      this.saveTokenToLocalStorage()
    ).subscribe();
  }

  onFileChange($event) {
    this.frameService.uplaodAnonymousImageToFrame($event.target.files[0], this.openAccess.frameId).percentageChanges()
      .subscribe(console.log);
  }

  private checkValidUrl() {
    return tap((openAccess: OpenAccess) => {
      if (openAccess != null) {
        this.openAccess = openAccess;
        this.errorMessage = null;
        this.fetchTokenFromLocalStorage();
      } else {
        this.errorMessage = 'This URL is invalid or has expired';
      }
    });
  }

  private checkError() {
    return catchError((error: firebase.functions.HttpsError) => {
      if (error.message.toLowerCase() === 'password does not match') {
        console.error('Passwords didn\'t match');
      } else {
        console.log(error.message);
      }
      return of(null);
    });
  }

  private saveTokenToLocalStorage() {
    return tap((result: firebase.functions.HttpsCallableResult) => {
      localStorage.setItem(this.openAccess.id, JSON.stringify({ token: result.data.token, expires: this.openAccess.enddate }));
      this.token = result.data.token;
    });
  }

  private fetchTokenFromLocalStorage() {
    const token = JSON.parse(localStorage.getItem(this.openAccess.id));
    if (token != null && token.token != null) {
      this.token = token.token;
    }
  }

}
