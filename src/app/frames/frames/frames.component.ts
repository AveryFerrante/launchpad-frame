import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, HostListener } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { Frame } from 'src/app/models/Frame';
import { concatMap, take, filter, debounceTime } from 'rxjs/operators';
import { of, Observable, Subscribable, Subscription } from 'rxjs';
import { GlobalEventsService } from 'src/app/services/global/global-events.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { UserInfo } from 'src/app/models/UserInfo';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private globalEventsService: GlobalEventsService, private route: ActivatedRoute) { }
  // Handle sidenav show/hide/toggle
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.checkWidth();
  }
  ngOnInit() {
    // Create Macrotask to avoid updating out of check. May need to redesign....
    setTimeout(() => this.globalEventsService.showHamburger(true));
    this.userInfo$ = (this.route.snapshot.data['UserInfo'] as Observable<UserInfo>);
    this.sidenavSubscription = this.globalEventsService.showSidenavEmitter.subscribe(
      (show) => {
        this.showSidenav = show;
        if (window.innerWidth < 992 && this.showSidenav === true && this.hasBeenHiddenOnSmall) {
          setTimeout(() => { const navbar = document.getElementById('topNav');
          const sidenav = document.getElementById('frameSidenav');
          sidenav.setAttribute('style', sidenav.getAttribute('style') + ' ' +
            `height: calc(${document.body.scrollHeight}px - ${navbar.offsetHeight}px);`); });
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
