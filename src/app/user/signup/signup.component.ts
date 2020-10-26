import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signUpForm: FormGroup;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.signUpForm = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      displayName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', Validators.required],
      occupation: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  signUp(value){
    this._authService.signUp(value).then(data => {
      console.log(data);
      this._router.navigate(['/home']);
    }, err => {
      console.log(err);
    });
  }

}
