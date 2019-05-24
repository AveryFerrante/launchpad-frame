import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramesComponent } from './frames/frames.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CreateFrameComponent } from './create-frame/create-frame.component';
import { FrameViewerComponent } from './frame-viewer/frame-viewer.component';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AngularCollapseModule } from 'angular-collapse';
import { FrameImageViewerComponent } from './frame-image-viewer/frame-image-viewer.component';
import { SlideshowModule } from 'ng-simple-slideshow';
import { RemovablePillComponent } from './removable-pill/removable-pill.component';

import { LoaderModule } from '../loader/loader.module';
import { FrameInfoComponent } from './frame-info/frame-info.component';
import { UserAddComponent } from './user-add/user-add.component';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    SlideshowModule,
    LoaderModule,
    AngularCollapseModule
  ],
  declarations: [
    FramesComponent,
    SidenavComponent,
    CreateFrameComponent,
    FrameViewerComponent,
    FrameImageViewerComponent,
    RemovablePillComponent,
    FrameInfoComponent,
    UserAddComponent
  ],
  exports: [FramesComponent]
})
export class FramesModule { }
