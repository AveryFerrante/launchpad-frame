import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { FramesManagerComponent } from './frames-manager/frames-manager.component';
import { FramesManagerSidenavComponent } from './frames-manager/frames-manager-sidenav/frames-manager-sidenav.component';
import { FramesManagerCreateComponent } from './frames-manager/frames-manager-create/frames-manager-create.component';

@NgModule({
  declarations: [
    NavbarComponent,
    MainComponent,
    FramesManagerComponent,
    FramesManagerSidenavComponent,
    FramesManagerCreateComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    ClrFormsNextModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
