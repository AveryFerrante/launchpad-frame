import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
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
    descriptionInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2),
      Validators.maxLength(1000)] }),
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
      tap((val: string) => {
        if (val.toLowerCase().trim() === this.userInfoService.currentState.username.toLowerCase().trim()) {
          this.errorMessage = 'You will be added to the frame automatically';
          this.loading = false;
        } else {
          this.errorMessage = null;
        }
      }),
      filter((val: string) => val !== '' && val !== null && val.length >= 2 &&
        val.toLowerCase().trim() !== this.userInfoService.currentState.username.toLowerCase().trim()),
      tap(() => this.loading = true),
      debounceTime(700),
      distinctUntilChanged(),
      switchMap((val: string) => this.userInfoService.checkUsername(val)),
      tap((username: Username) =>  {
        if (username !== null && this.usernameList.map((u: Username) => u.userid).indexOf(username.userid) === -1) {
          return username;
        } else {
          this.loading = false;
          this.errorMessage = 'No matching username';
          return null;
        }
      })
    ).subscribe((username: Username) => {
      if (username !== null) {
        this.usernameList.push(username);
      }
      this.loading = false;
    });
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
