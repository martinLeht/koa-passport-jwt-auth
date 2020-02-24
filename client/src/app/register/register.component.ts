import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RegisterPost } from './registerPost';
import { Observable } from 'rxjs';

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
  // HTTP root
  readonly ROOT_URL = 'http://localhost:3000';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
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
        Validators.pattern('^(?=.*[0-9])(?=[a-zA-Z])([a-zA-Z0-9]+)$')//([ !#,-_&\$\.\?+]) special chars
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



}
