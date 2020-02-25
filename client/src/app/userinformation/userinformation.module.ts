import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UserinformationRoutingModule } from './userinformation-routing.module';
import { UserInformationComponent} from './userinformation.component';

import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material/';
import {ReactiveFormsModule, FormControl, Validators} from '@angular/forms';

@NgModule({
  declarations: [UserInformationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    UserinformationRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class UserinformationModule { }
