import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalEventsService {

  private _showNavBar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showNavBarEmitter: Observable<boolean> = this._showNavBar.asObservable();

  private _showHamburger: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showHamburgerEmitter: Observable<boolean> = this._showHamburger.asObservable();

  private _showSidenav: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public showSidenavEmitter: Observable<boolean> = this._showSidenav.asObservable();

  constructor() { }

  showNavBar(ifShow: boolean) {
    this._showNavBar.next(ifShow);
  }

  showHamburger(show: boolean) {
    this._showHamburger.next(show);
  }

  showSidenav(show: boolean) {
    this._showSidenav.next(show);
  }

  toggleSidenav() {
    this._showSidenav.next(!this._showSidenav.getValue());
  }
}
