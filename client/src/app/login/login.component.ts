import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  // Form state
  loading = false;
  success = false;

  // HTTP root
  readonly ROOT_URL = 'http://localhost:3000';
  loginPost: any;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    // Init login form
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]
    ],
      password: ['',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(32),
        Validators.pattern('^(?=.*[0-9])(?=[a-zA-Z])([a-zA-Z0-9]+)$')//([ !#,-_&\$\.\?+]) special chars
      ]
    ],
    })
  }
  // Get functions
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  // Submit data
  async submitHandler() {
    this.loading = true;
    this.success = this.authService.loginUser(this.loginForm.value);
    console.log(this.success)
    this.loading = false;
  }

}
