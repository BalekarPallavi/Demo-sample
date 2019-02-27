import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {first} from 'rxjs/operators';

import {AlertService} from '../services/alert.service';
import {AuthenticationService} from '../services/authentication.service';
import get = Reflect.get;
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import {NGXLogger} from 'ngx-logger';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', ' src/assets/css/print.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  // private FB: FacebookLoginProvider;
   constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private authService: AuthService,
    private logger: NGXLogger,
   ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    // reset login status
    this.authenticationService.logout();

    // get retuen url from route parameter or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


    }

     // convenience getter for easy access to form fields
    get f() {
      return this.loginForm.controls;
      console.log(this.loginForm.controls);
    }

//   submitLogin() {
//     console.log('submit login to facebook');
// // FB.login();
//     FB.login((response) => {
//       console.log('submitLogin', response);
//       if (response.authResponse) {
//         // login success
//         // login success code here
//         // redirect to home page
//       } else {
//         console.log('User login failed');
//       }
//     });
//
//   }

  onSubmit() {
      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
        return;
          }
      this.loading = true;
      this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate([this.returnUrl]);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
            this.logger.debug(error);
            this.router.navigate(['/servererror']);
          });
    }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithLinkedIn(): void {
    this.authService.signIn(LinkedInLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }


  }


