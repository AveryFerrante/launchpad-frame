import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateAccount } from 'src/app/models/client-side/CreateAccount';
import { UserCredentials } from 'src/app/models/client-side/UserCredentials';

@Component({
  selector: 'app-create-account-panel',
  templateUrl: './create-account-panel.component.html',
  styleUrls: ['./create-account-panel.component.css']
})
export class CreateAccountPanelComponent implements OnInit {
  signUpForm = new FormGroup({
    emailInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.email] }),
    firstNameInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2)] }),
    lastNameInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2)] }),
    passwordInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required] }),
    passwordConfirmInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required] })
  });
  get emailCtrl() { return this.signUpForm.controls.emailInput; }
  get firstNameCtrl() { return this.signUpForm.controls.firstNameInput; }
  get lastNameCtrl() { return this.signUpForm.controls.lastNameInput; }
  get passwordCtrl() { return this.signUpForm.controls.passwordInput; }
  get passwordConfirmCtrl() { return this.signUpForm.controls.passwordConfirmInput; }
  submitted = false;
  passwordsMatch = false;
  @Output() create = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if (this.passwordCtrl.value !== this.passwordConfirmCtrl.value) {
      this.passwordsMatch = false;
    } else if (this.signUpForm.valid) {
      this.passwordsMatch = true;
      const credentials = new UserCredentials(this.emailCtrl.value, this.passwordCtrl.value);
      this.create.emit(new CreateAccount(this.firstNameCtrl.value, this.lastNameCtrl.value, credentials));
    }
  }

}
