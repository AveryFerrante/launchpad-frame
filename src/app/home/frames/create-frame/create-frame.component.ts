import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FramesService } from 'src/app/services/frames/frames.service';
import { UserInfoService } from 'src/app/services/userinfo/user-info.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-create-frame',
  templateUrl: './create-frame.component.html',
  styleUrls: ['./create-frame.component.css']
})
export class CreateFrameComponent implements OnInit {
  newFrameForm = new FormGroup({
    titleInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2),
      Validators.maxLength(100)] }),
    descriptionInput: new FormControl('', { updateOn: 'submit', validators: [Validators.required, Validators.minLength(2),
      Validators.maxLength(1000)] })
  });
  get titleCtrl() { return this.newFrameForm.controls.titleInput; }
  get descriptionCtrl() { return this.newFrameForm.controls.descriptionInput; }
  submitted = false;
  constructor(private frameService: FramesService, private userInfoService: UserInfoService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    if (this.newFrameForm.valid) {
      this.frameService.add(this.titleCtrl.value, this.descriptionCtrl.value).pipe(
        concatMap((frameId: string) => this.userInfoService.addOwnedFrames(frameId))
      ).subscribe();
    }
  }

}
