import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserCredentials } from 'src/app/models/client-side/UserCredentials';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {
  loginForm = new FormGroup({
    emailInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.email] }),
    passwordInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required] })
  });
  get emailCtrl() { return this.loginForm.controls.emailInput; }
  get passwordCtrl() { return this.loginForm.controls.passwordInput; }
  submitted = false;
  @Output() login = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.login.emit(new UserCredentials(this.emailCtrl.value, this.passwordCtrl.value));
    }
  }

}
