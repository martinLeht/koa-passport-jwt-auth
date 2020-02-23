import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginPost } from './loginPost';
//import { Observable } from 'rxjs';

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

  constructor(private fb: FormBuilder, private http: HttpClient) { }

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

  // RxJS submit
  async submitHandler() {
    this.loading = true;
    /*const emailValue = this.loginForm.get('email').value;
    const passwordValue = this.loginForm.get('password').value;
    console.log(emailValue);
    console.log(passwordValue);

    // Post data
    const data: LoginPost = {
      email: emailValue,
      password: passwordValue
    }
    */

    // Try to send the data
    try {
      this.loginPost = this.http.post(this.ROOT_URL + '/login', this.loginForm.value);
      this.success = true;
    } catch(err) {
      console.error(err);
    }
    
    this.loading = false;
  }

}
