import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
//import { userinfoPost } from './userinfoPost';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-userinformation',
  templateUrl: './userinformation.component.html',
  styleUrls: ['./userinformation.component.scss']
})
export class UserInformationComponent implements OnInit {

  informationForm: FormGroup;

  // Form state
  loading = false;
  success = false;
  // HTTP root
  readonly ROOT_URL = 'http://localhost:3000';

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    // Init register form
    this.informationForm = this.fb.group({
      name: ['',[Validators.required]],
      zip: ['',[Validators.required, Validators.pattern('^([0-9]{5})$')]]
    })
  }

}
