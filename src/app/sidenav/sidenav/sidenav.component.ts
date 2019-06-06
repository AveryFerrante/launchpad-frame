import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { tap, skip } from 'rxjs/operators';

@Component({
  selector: 'app-notification-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  _show = false;
  @Input() set showNotificationSidenav(val: boolean) { this._show = val; this.handleClickListener(); }
  get showNotificationSidenav() { return this._show; }
  @Output() showNotificationSidenavChange = new EventEmitter<boolean>();
  clickSub: Subscription = null;
  constructor() { }

  ngOnInit() { }

  onClose() {
    this.showNotificationSidenav = false;
    this.showNotificationSidenavChange.emit(false);
  }

  handleClickListener() {
    if (this.showNotificationSidenav) {
      this.initClickListener();
    } else {
      this.destroyClickListener();
    }
  }

  initClickListener() {
    this.clickSub = fromEvent(document, 'click').pipe(
      skip(1), // Event fired for clicking notification icon to open
      tap((e: MouseEvent) => {
        const element = e.target as Element;
        if (element.className === 'opaque-bg') {
          this.onClose();
        }
      })
    ).subscribe();
  }

  destroyClickListener() {
    if (this.clickSub !== null) {
      this.clickSub.unsubscribe();
      this.clickSub = null;
    }
  }

  ngOnDestroy() {
    this.destroyClickListener();
  }
}
