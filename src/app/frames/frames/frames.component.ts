import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { UserInfo } from 'src/app/models/UserInfo';

@Component({
  selector: 'app-frames',
  templateUrl: './frames.component.html',
  styleUrls: ['./frames.component.css']
})
export class FramesComponent implements OnInit {

  userInfo$: Observable<UserInfo>;
  sidenavSubscription: Subscription;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.userInfo$ = (this.route.snapshot.data['UserInfo'] as Observable<UserInfo>);
    this.userInfo$.pipe(
      take(1),
      tap((ui: UserInfo) => {
        const urlSegments = this.router.url.split('/');
        const deepestPath = urlSegments[urlSegments.length - 1];
        if (deepestPath.toLowerCase() === 'create' || (ui.frames && deepestPath in ui.frames)) {
          return;
        } else { // Route them to create frame or an existing frame (can't just go to '/frames')
          if (ui.frames && Object.keys(ui.frames).length > 0) {
            const frameId = Object.keys(ui.frames)[0];
            this.router.navigate(['/frames', frameId]);
          } else {
            this.router.navigate(['/frames', 'create']);
          }
        }
      })
    ).subscribe();
  }

}
