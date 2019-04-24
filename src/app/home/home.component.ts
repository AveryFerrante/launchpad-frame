import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../../UserInfo/user-info.service';
import { UserInfo } from '../models/UserInfo';
import { concatMap, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public userInfo$: Observable<UserInfo> = null;
  constructor(private router: ActivatedRoute, private userInfo: UserInfoService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.userInfo.clearUserInfo();
  }

}
