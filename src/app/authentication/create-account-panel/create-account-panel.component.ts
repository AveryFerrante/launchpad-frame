import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { CreateAccount } from 'src/app/models/client-side/CreateAccount';
import { UserCredentials } from 'src/app/models/client-side/UserCredentials';
import { UserInfoService } from 'src/app/services/userinfo/user-info.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-account-panel',
  templateUrl: './create-account-panel.component.html',
  styleUrls: ['./create-account-panel.component.css']
})
export class CreateAccountPanelComponent implements OnInit {
  signUpForm = new FormGroup({
    emailInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.email] }),
    usernameInput: new FormControl('', { updateOn: 'blur', validators: [Validators.required, Validators.minLength(2),
      Validators.maxLength(25)], asyncValidators: this.checkUsername.bind(this) }),
    firstNameInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2)] }),
    lastNameInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2)] }),
    passwordInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required] }),
    passwordConfirmInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required] })
  });
  get emailCtrl() { return this.signUpForm.controls.emailInput; }
  get usernameCtrl() { return this.signUpForm.controls.usernameInput; }
  get firstNameCtrl() { return this.signUpForm.controls.firstNameInput; }
  get lastNameCtrl() { return this.signUpForm.controls.lastNameInput; }
  get passwordCtrl() { return this.signUpForm.controls.passwordInput; }
  get passwordConfirmCtrl() { return this.signUpForm.controls.passwordConfirmInput; }
  submitted = false;
  checkedUsername = false;
  passwordsMatch = false;
  @Output() create = new EventEmitter();
  constructor(private userInfoService: UserInfoService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.signUpForm);
    this.submitted = true;
    if (this.passwordCtrl.value !== this.passwordConfirmCtrl.value) {
      this.passwordsMatch = false;
    } else if (this.signUpForm.valid) {
      this.passwordsMatch = true;
      const credentials = new UserCredentials(this.emailCtrl.value, this.passwordCtrl.value);
      this.create.emit(new CreateAccount(this.usernameCtrl.value, this.firstNameCtrl.value, this.lastNameCtrl.value, credentials));
    }
  }

  private checkUsername(control: AbstractControl) {
    this.checkedUsername = true;
    return this.userInfoService.checkUsername(control.value).pipe(
      map((res) => res ? null : { 'usernameTaken': true })
    );
  }

}
