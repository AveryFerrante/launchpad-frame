import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramesComponent } from './frames/frames.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CreateFrameComponent } from './create-frame/create-frame.component';
import { FrameViewerComponent } from './frame-viewer/frame-viewer.component';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  declarations: [
    FramesComponent,
    SidenavComponent,
    CreateFrameComponent,
    FrameViewerComponent
  ],
  exports: [FramesComponent]
})
export class FramesModule { }
