import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-notification-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  _show = false;
  @Input() set showNotificationSidenav(val: boolean) { this._show = val; }
  // tslint:disable-next-line: no-output-rename
  @Output('showNotificationSidenav') showOutputEvent = new EventEmitter();
  get showNotificationSidenav() { return this._show; }
  constructor() { }

  ngOnInit() {
    const a = fromEvent(document, 'click').pipe(
      tap((e) => console.log(e))
    ).subscribe();
  }

}
