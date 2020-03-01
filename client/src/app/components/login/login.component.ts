import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';


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

  isLoggedIn = false;
  error: [number, string];
  returnUrl: string;
  alert: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private fb: FormBuilder, 
    private authService: AuthService, 
    private tokenStorage: TokenStorageService
  ) { 
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/']);
    } else {
      if (this.router.getCurrentNavigation().extras.state) {
        this.alert = this.router.getCurrentNavigation().extras.state.success; 
      } else {
        this.alert = undefined;
      }
    }
    
  }

  ngOnInit() {
    this.isLoggedIn = false;
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
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
    this.authService.loginUser(this.loginForm.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);
        
        this.success = true;
        this.isLoggedIn = true;
        
        this.reloadPage();
      },
      err => {
        this.error = [err.status, err.error.error];
        this.success = false;
        console.log(this.error);
      }
    );
    this.loading = false;
  }

  reloadPage() {
    window.location.reload();
  }

}
