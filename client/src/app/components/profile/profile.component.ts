import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { IUser } from 'src/app/models/IUser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  formEditOn = false;
  user: IUser;
  usernameVal = "";
  realnameVal = "";
  emailVal = "";
  hoodVal = "";
  zipVal = "";


  constructor(private fb: FormBuilder, private uSer: UserService) { }

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: [this.usernameVal],
      realname: [this.realnameVal],
      email: [this.emailVal],
      hood: [this.hoodVal],
      zip: [this.zipVal]
    })
  }

    // Get functions
    get username() {
      return this.profileForm.get('username');
    }
    get realname() {
      return this.profileForm.get('realname');
    }
    get email() {
      return this.profileForm.get('email');
    }
    get hood() {
      return this.profileForm.get('hood');
    }
    get zip() {
      return this.profileForm.get('zip');
    }

  initUserData(){

  }

  editToggle(){
    if(this.formEditOn){
      this.formEditOn = false;
      console.log("toggle: "+ this.formEditOn);
    }else{
      this.formEditOn = true;
      console.log("toggle: "+ this.formEditOn);
    }
  }

}
