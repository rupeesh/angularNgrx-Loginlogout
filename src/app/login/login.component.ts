import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup,  Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthResponse } from '../appinterface/auth.response';
import { AuthserviceService } from '../auth/auth.service';
import { ErrorService } from '../service/error.service';
import { loginStart, signupStart } from '../state/auth.actions';
import { AppState } from '../store/app.state';
import { setLoadingSpinner } from '../store/shared/shared.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  LoginMode:boolean = true;
  //error;
  
  signUpForm: FormGroup;
  constructor(private router: Router, private _authService: AuthserviceService, private _errService:ErrorService, private store: Store<AppState>) { 
    this.signUpForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      
    });
  }

  ngOnInit() {
  }

  onModeSwitch(){
    this.LoginMode = !this.LoginMode;
  }

  onSubmit(){

    if(this.signUpForm.valid){
      console.log(this.signUpForm.value);

      const email = this.signUpForm.value.email;
      const password  = this.signUpForm.value.password;
      
      let authObservable : Observable<AuthResponse>;

      if(this.LoginMode){
          ///login
          this.store.dispatch(setLoadingSpinner({status:true}) )
        this.store.dispatch(loginStart({email,password}));
        
      } //if
      else{
         //authObservable = this._authService.signUp(email, password)
         this.store.dispatch(setLoadingSpinner({status:true}) )
        this.store.dispatch(signupStart({email, password}))
      } //else

      // authObservable.subscribe(
      //   res => {
      //     console.log(res);
      //     this.router.navigate(['/dashboard']);
      //   },
      //   err => {
      //     console.log(err);
      //     this.error = err;
      //   }

      // ) //authobservale
    }
    else{
      console.log('please enter valid details')
    }

//this.router.navigate(['/home']);  
}

  

}
