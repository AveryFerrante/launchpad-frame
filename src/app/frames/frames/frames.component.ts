import { Component, OnInit, OnDestroy, AfterViewInit, AfterViewChecked, HostListener } from '@angular/core';
import { FramesService } from 'src/app/services/frames/frames.service';
import { Frame } from 'src/app/models/Frame';
import { concatMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { GlobalEventsService } from 'src/app/services/global/global-events.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-frames',
  templateUrl: './frames.component.html',
  styleUrls: ['./frames.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(-100%)', opacity: .75}),
          animate('150ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('0ms', style({transform: 'translateX(-100%)', opacity: .75}))
        ])
      ]
    )
  ],
})
export class FramesComponent implements OnInit, OnDestroy {

  showSidenav = true;
  overlaySidebar = false;
  constructor(private globalEventsService: GlobalEventsService) { }
  // Handle sidenav show/hide/toggle
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.checkWidth(window.innerWidth);
  }
  ngOnInit() {
    // Create Macrotask to avoid updating out of check. May need to redesign....
    setTimeout(() => this.globalEventsService.showHamburger(true));
    this.globalEventsService.showSidenavEmitter.subscribe(
      (show) => this.showSidenav = show
    );
    this.checkWidth(window.innerWidth);
  }

  private checkWidth(width) {
    if (width < 992) {
      this.globalEventsService.showSidenav(false);
      this.overlaySidebar = true;
    } else {
      this.globalEventsService.showSidenav(true);
      this.overlaySidebar = false;
    }
  }

  ngOnDestroy() {
    this.globalEventsService.showHamburger(false);
  }


}
