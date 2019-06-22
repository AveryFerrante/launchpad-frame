import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { switchMap, take, tap } from 'rxjs/operators';
import { OpenAccess } from 'src/app/models/client-side/OpenAccess';
import { OpenAccessService } from 'src/app/services/open-access/open-access.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  password: string;
  errorMessage: string;
  private openAccess: OpenAccess = null;
  constructor(private activatedRoute: ActivatedRoute, private openAccessService: OpenAccessService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        return this.openAccessService.getOpenAccessByUrl(params.get('id')).pipe(this.checkValidUrl());
      })
    ).pipe(take(1)).subscribe();
  }

  createAccessToken(password: string) {
    const func = firebase.functions().httpsCallable('createOpenAccessToken');
    func({ password: password, openAccessId: this.openAccess.id })
      .then(result => {
        console.log('result: ', result.data.token);
      })
      .catch((err: firebase.functions.HttpsError) => {
        if (err.message.toLowerCase() === 'password does not match') {
          console.error('The passwords didn\'t match, try again');
        }
      });
  }

  private checkValidUrl() {
    return tap((openAccess: OpenAccess) => {
      if (openAccess != null) {
        this.openAccess = openAccess;
        this.errorMessage = null;
      } else {
        this.errorMessage = 'This URL is invalid or has expired';
      }
    });
  }

}
