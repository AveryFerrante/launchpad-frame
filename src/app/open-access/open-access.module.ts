import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';

import { LoaderModule } from '../loader/loader.module';

@NgModule({
  imports: [
    CommonModule,
    LoaderModule
  ],
  declarations: [LandingPageComponent],
  exports: [LandingPageComponent]
})
export class OpenAccessModule { }
