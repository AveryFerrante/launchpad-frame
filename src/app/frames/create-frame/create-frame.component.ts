import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, map } from 'rxjs/operators';
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
    userSearchInput: new FormControl()
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

  private setUserSearchObservable() {
    this.userSearch = this.newFrameForm.controls.userSearchInput.valueChanges.pipe(
      map((val: string) => {
        if (val !== '' && val !== null && val.length >= 2) {
          this.errorMessage = null;
          return val;
        } else {
          return null;
        }
      }),
      filter((val: string) => val !== null),
      tap(() => this.loading = true),
      debounceTime(700),
      map((val: string) => {
        if (this.usernamesMatch(val)) {
          this.errorMessage = 'You will be added to the frame automatically';
          this.loading = false;
          return null;
        } else {
          return val;
        }
      }),
      switchMap((val: string) => this.userInfoService.checkUsername(val)),
      map((username: Username) =>  {
        if (username === null) {
          if (this.errorMessage === null) { // Make sure that we don't overwrite 'You will be added message' from above
            this.errorMessage = 'No matching username';
          }
          this.loading = false;
          return null;
        } else if (this.usernameList.map((u: Username) => u.userid).indexOf(username.userid) !== -1) {
          this.errorMessage = 'User is already added';
          this.loading = false;
          return null;
        } else {
          return username;
        }
      })
    ).subscribe((username: Username) => {
      if (username !== null) {
        this.usernameList.push(username);
      }
      this.loading = false;
    });
  }

  onRemoveUsername(username: Username) {
    this.usernameList.splice(this.usernameList.indexOf(username), 1);
  }

  private usernamesMatch(val: string): boolean {
    return val.toLowerCase().trim() === this.userInfoService.currentState.username.toLowerCase().trim();
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
