import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthResponse } from '../appinterface/auth.response';
import { User } from '../usermodel/user.model';
import {config} from '../config';
import { ErrorService } from '../service/error.service';



@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  user = new BehaviorSubject<User>(null);
  
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private _errService: ErrorService, private router:Router) { }

signUp(email, password){
 return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.API_KEY}`, {
   email:email,
   password:password,
   returnSecureToken: true
 }).pipe(
  catchError(err =>{
    return this._errService.handleError(err);
  }), 
  tap(res =>{
    console.log(res);
    this.authenticateUser(res.email, res.localId, res.idToken, +res.expiresIn)
  })
 )
}


signIn(email, password){
  return this.http.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.API_KEY}`,{
   email:email,password:password,
   returnSecureToken: true

  }).pipe(
    catchError(err =>{
      return this._errService.handleError(err);
    }), 
    tap(res =>{
      console.log(res);
      this.authenticateUser(res.email, res.localId, res.idToken, +res.expiresIn)
    })
   )
}

autoSignIn(){
  const userData = JSON.parse(localStorage.getItem('UserData'));

  if(!userData){
    return;
  }

  const loggedInUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
  if(loggedInUser.token){
    this.user.next(loggedInUser);
    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
   this.autoSignOut(expirationDuration); 
  }
}

signOut(){
  this.user.next(null);
  this.router.navigate(['']);
  localStorage.removeItem('UserData');

  if(this.tokenExpirationTimer){
    clearTimeout(this.tokenExpirationTimer)
  }
  this.tokenExpirationTimer = null;
}

autoSignOut(expirationDuration:number){
this.tokenExpirationTimer = setTimeout(() => {
this.signOut();
}, expirationDuration)
}

private authenticateUser(email, userId, token, expiresIn){
  const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
  const user = new User(email, userId, token, expirationDate);
  
  console.log('user =>', user);
  this.user.next(user); //this will emit the user;
  this.autoSignOut(expiresIn*1000);  
  localStorage.setItem('UserData', JSON.stringify(user));
  
}


forgetPassword(data){
  return this.http.post<any>(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${config.API_KEY}`, {
    requestType:'PASSWORD_RESET',
    email:data.email
  }).pipe(
    catchError(err =>{
      return this._errService.handleError(err);
    })
  )
}


}
