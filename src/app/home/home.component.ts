import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Router } from '@angular/router';
import { UserinfoStoreService } from '../services/stores/userinfostore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router, public userInfoStore: UserinfoStoreService) { }

  ngOnInit() {
    // this.userInfoStore.initializeUserInfo();
  }

  onLogout() {
    this.authService.signOut().then(
      resp => {
        this.router.navigate(['/login']);
      }
    );
  }

}
