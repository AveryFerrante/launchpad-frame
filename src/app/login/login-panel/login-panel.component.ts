import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {
  loginForm = new FormGroup({
    emailInput: new FormControl('', [Validators.required, Validators.email]),
    passwordInput: new FormControl('', [Validators.required])
  });
  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.loginForm);
    console.warn(this.loginForm.value);
  }

}
