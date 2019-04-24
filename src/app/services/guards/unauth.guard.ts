import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { GlobalEventsService } from '../global/global-events.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuardGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthenticationService, private router: Router, private globalEventService: GlobalEventsService) {}
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // CurrentUser can take a bit to initialize for firebase, must use observable to wait for emmitted value
    return this.checkLoggedIn();
  }

  canActivateChild() {
    return this.checkLoggedIn();
  }

  checkLoggedIn() {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user == null) {
          this.router.navigate(['/login']);
          return false;
        } else {
          this.globalEventService.showNavBar(true);
          return true;
        }
      })
    );
  }
}
