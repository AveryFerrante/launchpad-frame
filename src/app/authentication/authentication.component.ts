import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  showLoginForm: boolean;
  showCreateAccountForm: boolean;
  panelTitle: string;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.url.subscribe((u) => {
      if(u[0] && u[0].path === 'login') {
        this.showLoginForm = true;
        this.showCreateAccountForm = false;
        this.panelTitle = 'Login';
      } else if (u[0] && u[0].path === 'create-account') {
        this.showCreateAccountForm = true;
        this.showLoginForm = false;
        this.panelTitle = 'Create Account';
      }
    });
  }
}
