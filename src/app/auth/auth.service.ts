import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse } from '../appinterface/auth.response';
import { User } from '../usermodel/user.model';
import {config} from '../config';
import { ErrorService } from '../service/error.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { autoLogout } from '../state/auth.actions';



@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  user = new BehaviorSubject<User>(null);
  
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private _errService: ErrorService, private router:Router, private store:Store<AppState>) { }

signUp(email:string, password:string): Observable<AuthResponse> {
 return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.API_KEY}`, {
   email:email,
   password:password,
   returnSecureToken: true

 })
//  .pipe(
//   catchError(err =>{
//     return this.handleError(err);
//   }), 
//   tap(res =>{
//     console.log(res);
//     this.authenticateUser(res.email, res.localId, res.idToken, +res.expiresIn)
//   })
//  )
}


signIn(email:string, password:string){
  return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.API_KEY}`,{
   email:email,password:password,
   returnSecureToken: true

  }).pipe(
    // catchError(err =>{
    //   return this.handleError(err);
    // }), 
    tap(res =>{
      console.log(res);
      this.authenticateUser(res.email, res.localId, res.idToken, +res.expiresIn)
    })
   )
}

autoSignIn(){
  const userData = JSON.parse(localStorage.getItem('UserData'));

  if(!userData){
    return null;
  }

  const loggedInUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
  if(loggedInUser.token){
    //this.user.next(loggedInUser);
    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
   this.autoSignOut(expirationDuration); 
   return loggedInUser;
  }
  
}

signOut(){
  this.user.next(null);
  //this.router.navigate(['']);
  localStorage.removeItem('UserData');

  if(this.tokenExpirationTimer){
    clearTimeout(this.tokenExpirationTimer)
    this.tokenExpirationTimer = null;
  }

}

autoSignOut(expirationDuration:number){
this.tokenExpirationTimer = setTimeout(() => {
this.store.dispatch(autoLogout);
}, expirationDuration)
}

public authenticateUser(email, userId, token, expiresIn){
  const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
  const user = new User(email, userId, token, expirationDate);
  
  console.log('user =>', user);
  this.user.next(user); //this will emit the user;
  this.autoSignOut(expiresIn*1000);  
  localStorage.setItem('UserData', JSON.stringify(user));
  return user
  
}


forgetPassword(data){
  return this.http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${config.API_KEY}`, {
    requestType:'PASSWORD_RESET',
    email:data.email
  }).pipe(
    catchError(err =>{
      return this.handleError(err);
    })
  )
}

 
handleError(err:HttpErrorResponse){
  
  if(!err.error || !err.error.error){
    //this.error = this.errMsgs['UNKNOWN'];
    return throwError(this.errorMsgs['UNKNOWN']);
  }
  else{
  //this.error = this.errMsgs[err.error.error.message];
return throwError (this.errorMsgs[err.error.error.message]);
    }//else
    
}
  
  errorMsgs (message: string) {
    switch(message){
      case 'UNKNOWN':
        return  "An Unknow Error has occurred";
      case 'EMAIL_EXISTS':
        return  "The email address is already in use by another account.";
      case 'OPERATION_NOT_ALLOWED':
        return  "Password sign-in is disabled for this project.";
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        return  "We have blocked all requests from this device due to unusual activity. Try again later.";
      case 'EMAIL_NOT_FOUND':
        return  "There is no user record corresponding to this identifier. The user may have been deleted.";
      case 'INVALID_PASSWORD':
        return  "The password is invalid or the user does not have a password.";

      case 'USER_DISABLED':
        return  "The user account has been disabled by an administrator.";
        default:
        return 'Unknown error occurred. Please try again';
    }
      }


}
