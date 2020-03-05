import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { IUser } from 'src/app/models/IUser';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  
  alerts: Map<string, Array<string>>;

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private userService: UserService, 
    private tokenStorage: TokenStorageService
  ) { 
    this.alerts = new Map();
    this.alerts.set('success', []);
    this.alerts.set('error', []);
    if (this.router.getCurrentNavigation() != null && this.router.getCurrentNavigation().extras.state) {
      if (this.router.getCurrentNavigation().extras.state.success) {
        this.alerts.get('success').push(this.router.getCurrentNavigation().extras.state.success);
      }
      if (this.router.getCurrentNavigation().extras.state.error) {
        this.alerts.get('error').push(this.router.getCurrentNavigation().extras.state.error);
      }
    }
  }

  ngOnInit() {
    this.initUserData();
    this.profileForm = this.fb.group({
      username: [this.usernameVal],
      realname: [this.realnameVal],
      email: [this.emailVal],
      hood: [this.hoodVal],
      zip: [this.zipVal]
    });
    this.profileForm.disable();
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

  initUserData() {
    let id: number = this.tokenStorage.getCurrentUser().id;
    this.usernameVal = this.tokenStorage.getCurrentUser().username;
    this.emailVal = this.tokenStorage.getCurrentUser().email;
  }

  editToggle(){
    if (this.formEditOn) {
      this.formEditOn = false;
      this.profileForm.disable();
      console.log("toggle: "+ this.formEditOn);
    } else {
      this.formEditOn = true;
      this.profileForm.enable();
      this.profileForm.controls['email'].disable();
      this.profileForm.controls['realname'].disable();
      this.profileForm.controls['hood'].disable();
      this.profileForm.controls['zip'].disable();
      console.log("toggle: "+ this.formEditOn);
    }
  }

  clearAlerts() {
    this.alerts.clear();
    this.alerts.set('success', []);
    this.alerts.set('error', []);
  }

  async deleteAccount() {
    if(window.confirm('Are sure you want to delete your account?')){
      let id: number = this.tokenStorage.getCurrentUser().id;
      this.userService.deleteUser(id).subscribe(
        (res) => {
          this.tokenStorage.signOut();
          this.router.navigate(['/login'], { state: { success: res.success }});
        },
        error => {
          console.log(error);
          this.clearAlerts();
          this.alerts.get('error').push('Something went wrong, try again later!');
        }
      );
    }
  }

  async onSubmit() {
    if (this.formEditOn) {
      let id: number = this.tokenStorage.getCurrentUser().id;
      this.userService.updateUser(id, this.profileForm.value).subscribe(
        (res) => {
          this.tokenStorage.saveUser(res.user);
          this.clearAlerts();
          this.alerts.get('success').push(res.success);
          this.initUserData();
          this.editToggle();
        },
        error => {
          console.log(error);
          this.clearAlerts();
          this.alerts.get('error').push(error.error);
        }
      );
    }
  }

}
