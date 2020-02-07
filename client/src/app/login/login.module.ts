import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent} from './login.component';

import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatMenuModule,
  ]
})
export class LoginModule { }
