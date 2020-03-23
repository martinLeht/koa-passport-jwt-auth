import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  // Form state
  loading = false;
  success = false;

  alerts: Map<string, Array<string>>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private tokenStorage: TokenStorageService
  ) {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.alerts = new Map();
    this.alerts.set('success', []);
    this.alerts.set('error', []);
    // Init register form
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]
    ],
    username: '',
      password: ['',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern('^[a-zA-Z0-9!@#$&()\\-`.+,/\"]*$')/*BEFORE '^(?=.*[0-9])(?=[a-zA-Z])([a-zA-Z0-9]+)$'*/ //special chars([ !#,-_&\$\.\?+]) 
      ]
    ],
    })
  }

  // Get functions
  get email() {
    return this.registerForm.get('email');
  }
  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }

  clearAlerts() {
    this.alerts.clear();
    this.alerts.set('success', []);
    this.alerts.set('error', []);
  }

  registerUser() {
    this.userService.register(this.registerForm.value).subscribe(
      (res) => {
        if (res.success) {
          this.registerForm.reset();
          this.router.navigate(['/login'], { state: { success: res.success } });
        }
      }, err => {
        this.clearAlerts();
        this.alerts.get('error').push(err.error.error);
        this.registerForm.reset();
    });
  }



}
