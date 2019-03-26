import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';

const appRoutes: Routes = [
  { path: 'login', component: AuthenticationComponent },
  { path: 'create-account', component: AuthenticationComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
