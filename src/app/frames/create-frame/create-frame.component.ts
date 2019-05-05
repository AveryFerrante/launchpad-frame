import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pipe, Subscription } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Username } from 'src/app/models/Username';
import { FramesService } from 'src/app/services/frames/frames.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { UserInfoService } from 'src/UserInfo/user-info.service';

@Component({
  selector: 'app-create-frame',
  templateUrl: './create-frame.component.html',
  styleUrls: ['./create-frame.component.css']
})
export class CreateFrameComponent implements OnInit, OnDestroy {
  newFrameForm = new FormGroup({
    titleInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2),
      Validators.maxLength(100)] }),
    descriptionInput: new FormControl('', { updateOn: 'submit', validators: [Validators.maxLength(1000)] }),
    userSearchInput: new FormControl('')
  });
  get titleCtrl() { return this.newFrameForm.controls.titleInput; }
  get descriptionCtrl() { return this.newFrameForm.controls.descriptionInput; }
  submitted = false;
  userSearch: Subscription;
  usernameList: Username[] = [];
  errorMessage: string = null;
  loading = false;
  constructor(private frameService: FramesService, private userInfoService: UserInfoService,
    private router: Router, private notificationsService: NotificationsService) {
  }

  ngOnInit() {
    this.setUserSearchObservable();
  }

  private filterValuesWithErrorMessages() {
    return pipe(
      tap((val: string) => { if (this.usernamesMatch(val)) { this.errorMessage = 'You will be added to the frame automatically'; }}),
      tap((val: string) => { if (this.usernameInArray(val)) { this.errorMessage = 'User is already added'; }}),
      tap((val: string) => { if (val.length < 2) { this.errorMessage = ''; }}),
      filter((val: string) => (val.length >= 2 && !this.usernamesMatch(val) && !this.usernameInArray(val))),
    );
  }

  private checkResponseNull() {
    return pipe(
      tap((val: Username) => { if (val === null) { this.errorMessage = 'No matching username'; }}),
      filter((val: Username) => val !== null)
    );
  }

  private addUsername() {
    return tap((val: Username) => {
      this.usernameList.push(val);
      this.errorMessage = '';
    });
  }

  private setUserSearchObservable() {
    const userSearch$ = this.newFrameForm.controls.userSearchInput.valueChanges;
    this.userSearch = userSearch$.pipe(
      debounceTime(500),
      tap(() => this.loading = false),
      this.filterValuesWithErrorMessages(),
      tap(() => this.loading = true),
      switchMap((val: string) => this.userInfoService.checkUsername(val).pipe(
        takeUntil(userSearch$)
      )),
      tap(() => this.loading = false),
      this.checkResponseNull(),
      this.addUsername(),
      tap(() => this.newFrameForm.controls.userSearchInput.setValue(''))
    ).subscribe();
  }

  onRemoveUsername(username: Username) {
    this.usernameList.splice(this.usernameList.indexOf(username), 1);
  }

  private usernamesMatch(val: string): boolean {
    return val.toLowerCase().trim() === this.userInfoService.currentState.username.toLowerCase().trim();
  }

  private usernameInArray(value: string): boolean {
    const valueTrimmed = value.toLowerCase().trim();
    return this.usernameList.map((uname: Username) => uname.usernametrimmed).indexOf(valueTrimmed) !== -1;
  }

  onSubmit() {
    this.submitted = true;
    if (this.newFrameForm.valid) {
      this.frameService.add(this.titleCtrl.value, this.descriptionCtrl.value, this.usernameList).subscribe({
        next: (frameId: string) => {
          if (this.usernameList.length > 0) {
            const userids = this.usernameList.map((username: Username) => username.userid);
            this.notificationsService.addNewFrameNotifications(frameId, this.titleCtrl.value, userids);
          }
          this.router.navigate(['frames', frameId]);
        }
      });
    }
  }

  ngOnDestroy() {
    this.userSearch.unsubscribe();
  }
}
