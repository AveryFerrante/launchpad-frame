import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginPanelComponent } from './login/login-panel/login-panel.component';
import { CreateAccountPanelComponent } from './login/create-account-panel/create-account-panel.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginPanelComponent },
  { path: 'create-account', component: CreateAccountPanelComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
