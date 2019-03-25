import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';

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
  errorMessage: string;
  constructor(private fireAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.fireAuth.auth.signInWithEmailAndPassword(this.emailCtrl.value, this.passwordCtrl.value).then(
        resp => {
          // TODO
        },
        error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            this.errorMessage = 'Email or password is incorrect.';
          } else if (errorCode === 'auth/user-not-found') {
            this.errorMessage = 'No matching user found for the provided email.';
          } else if (errorCode === 'auth/invalid-email') {
            this.errorMessage = 'Email is invalid.';
          } else if (errorCode === 'auth/user-disabled') {
            this.errorMessage = 'This account has been disabled.';
          } else { // This scenario shouldn't happen really

          }
        }
      );
    }
  }

}
