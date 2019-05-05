import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserInfo } from 'src/app/models/UserInfo';
import { GlobalEventsService } from 'src/app/services/global/global-events.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-frames',
  templateUrl: './frames.component.html',
  styleUrls: ['./frames.component.css']
})
export class FramesComponent implements OnInit, OnDestroy {

  showSidenav = true;
  overlaySidebar = false;
  hasBeenHiddenOnSmall = false; // Used so we only auto hide sidenav once after going small
  hasBeenShownOnBig = false; // Used so we only auto show sidenav once after getting big
  userInfo$: Observable<UserInfo>;
  sidenavSubscription: Subscription;
  constructor(private globalEventsService: GlobalEventsService, private route: ActivatedRoute, private router: Router) { }
  // Handle sidenav show/hide/toggle
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.checkWidth();
  }
  ngOnInit() {
    // Create Macrotask to avoid updating out of check. May need to redesign....
    setTimeout(() => this.globalEventsService.showHamburger(true));
    this.userInfo$ = (this.route.snapshot.data['UserInfo'] as Observable<UserInfo>);
    this.userInfo$.pipe(
      map((ui: UserInfo) => {
        if (Object.keys(ui.frames).length > 0) {
          const frameId = Object.keys(ui.frames)[0];
          this.router.navigate(['/frames', frameId]);
        } else {
          this.router.navigate(['/frames', 'create']);
        }
      })
    ).subscribe().unsubscribe();
    this.sidenavSubscription = this.globalEventsService.showSidenavEmitter.subscribe(
      (show) => {
        this.showSidenav = show;
        if (this.showSidenav === true && this.hasBeenHiddenOnSmall) {
          setTimeout(() => {
            const navbar = document.getElementById('topNav');
            const sidenav = document.getElementById('frameSidenav');
            sidenav.setAttribute('style', sidenav.getAttribute('style') + ' ' +
              `height: calc(${document.body.offsetHeight}px - ${navbar.offsetHeight}px);`);
          });
        }
      }
    );
    this.checkWidth();
  }

  private checkWidth() {
    if (window.innerWidth < 992) {
      if (!this.hasBeenHiddenOnSmall) {
        this.globalEventsService.showSidenav(false);
        this.hasBeenHiddenOnSmall = true;
        this.hasBeenShownOnBig = false;
        this.overlaySidebar = true;
      }
    } else {
      if (!this.hasBeenShownOnBig) {
        this.globalEventsService.showSidenav(true);
        this.overlaySidebar = false;
        this.hasBeenHiddenOnSmall = false;
        this.hasBeenShownOnBig = true;
      }
    }
  }

  ngOnDestroy() {
    this.sidenavSubscription.unsubscribe();
    this.globalEventsService.showHamburger(false);
  }


}
