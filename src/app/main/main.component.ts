import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  showNavbar = false;
  ngOnInit() {
    console.log(this.router.url);
    this.activatedRoute.url.pipe(tap((u) => console.log(u))).subscribe((u: UrlSegment[]) => {
      if (u[0] && (u[0].path === 'login' || u[0].path === 'create-account')) {
        this.showNavbar = false;
      } else {
        this.showNavbar = true;
      }
    });
  }

}
