import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { UserInfo } from 'src/app/models/UserInfo';
import { UserInfoService } from 'src/UserInfo/user-info.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserInfoResolveService implements Resolve<boolean> {

  constructor(private userInfoService: UserInfoService, private authService: AuthenticationService) { }

  resolve(): boolean {
    if (this.userInfoService.currentSnapshot === null) {
      this.userInfoService.getUserInfo(this.authService.currentUser.uid).subscribe();
    }
    return true;
  }
}
