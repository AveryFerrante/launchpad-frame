import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  }

  onNewUsernames(usernames: Username[]) {
    this.usernameList = usernames;
  }

  onRemoveUsername(username: Username) {
    this.usernameList.splice(this.usernameList.indexOf(username), 1);
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
  }
}
