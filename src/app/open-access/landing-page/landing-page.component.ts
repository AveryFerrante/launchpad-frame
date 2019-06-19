import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { OpenAccessService } from 'src/app/services/open-access/open-access.service';
import { OpenAccess } from 'src/app/models/client-side/OpenAccess';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  password: string;
  errorMessage: string;
  constructor(private activatedRoute: ActivatedRoute, private openAccessService: OpenAccessService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        return this.openAccessService.getPasswordByUrl(params.get('id')).pipe(this.checkValidPassword());
      })
    ).pipe(take(1)).subscribe();

    this.openAccessService.addNewAnonymousUser('7AcxenGhMDCRe2GdWOvi').subscribe(id => console.log('temp id: ', id));
  }

  private checkValidPassword() {
    return tap((openAccess: OpenAccess) => {
      console.log(openAccess);
      if (openAccess != null) {
        this.errorMessage = null;
        this.password = openAccess.password;
      } else {
        this.password = null;
        this.errorMessage = 'This URL is invalid or has expired';
      }
    });
  }

}
