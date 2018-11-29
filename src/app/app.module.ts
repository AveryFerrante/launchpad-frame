import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { FramesManagerComponent } from './frames-manager/frames-manager.component';
import { FramesManagerSidenavComponent } from './frames-manager/frames-manager-sidenav/frames-manager-sidenav.component';

@NgModule({
  declarations: [
    NavbarComponent,
    MainComponent,
    FramesManagerComponent,
    FramesManagerSidenavComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
