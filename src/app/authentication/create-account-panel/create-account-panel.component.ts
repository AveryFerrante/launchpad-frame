import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CreateAccount } from 'src/app/models/client-side/CreateAccount';

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
  @Output() onCreate = new EventEmitter();
  constructor(private fireAuth: AngularFireAuth, private db: AngularFirestore) { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if(this.passwordCtrl.value !== this.passwordConfirmCtrl.value) {
      this.passwordsMatch = false;
    }
    else if (this.signUpForm.valid) {
      this.passwordsMatch = true;
      this.onCreate.emit(new CreateAccount(this.emailCtrl.value, this.firstNameCtrl.value, this.lastNameCtrl.value, this.passwordCtrl.value));
      // this.fireAuth.auth.createUserWithEmailAndPassword(this.emailCtrl.value, this.passwordCtrl.value).then(
      //   resp => {
      //     this.db.collection('users').add(new UserInfo(this.firstNameCtrl.value, this.lastNameCtrl.value, resp.user.uid).getData()).then(
      //       a => console.log(a),
      //       e => console.log(e));
      //   },
      //   error => {
      //     console.log(error);
      //   }
      // );
    }
  }

}
