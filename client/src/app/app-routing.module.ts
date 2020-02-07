import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {RegisterComponent}   from './register/register.component';
import {UserInformationComponent}   from './userinformation/userinformation.component';
import {ProfileComponent}   from './profile/profile.component';


const routes: Routes = [
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  {path: 'register', component: RegisterComponent},
  {path: 'userinformation', component: UserInformationComponent},
  {path: 'profile', component: ProfileComponent},
  {path: '', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
