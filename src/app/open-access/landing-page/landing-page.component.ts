import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  urlValidator$: Observable<string>;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.urlValidator$ = this.activatedRoute.paramMap.pipe(
      map(params => {
        return params.get('id');
      })
    );
  }

}
