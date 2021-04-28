import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import {  catchError, exhaustMap, map, mergeMap, tap } from "rxjs/operators";
import { autoLogout, autoLogin, loginStart, loginSuccess, signupStart, signupSuccess } from "./auth.actions";
import { AppState } from "../store/app.state";
import { setErrorMessage, setLoadingSpinner } from "../store/shared/shared.actions";
import { AuthserviceService } from "../auth/auth.service";
import { of } from "rxjs";
import { Router } from "@angular/router";


@Injectable()
export class AuthEffects{

 constructor(private actions$: Actions, private _authService:AuthserviceService, private store:Store<AppState>, private router:Router){}


 signIn$ = createEffect(() => {
     return this.actions$.pipe(ofType(loginStart), exhaustMap((action) => {
        return this._authService.signIn(action.email,action.password).pipe(
            map((data) => {
                this.store.dispatch(setLoadingSpinner({status:false}))
                this.store.dispatch(setErrorMessage({message:''}))
              const user = this._authService.authenticateUser(data.email, data.localId, data.idToken, data.expiresIn);  
                //this._authService.autoSignIn();
                return loginSuccess({user, redirect:true});
        }),
        catchError(errResp => {
            this.store.dispatch(setLoadingSpinner({status:false}));
            const errorMessage = this._authService.errorMsgs(errResp.error.error.message);
            return of(setErrorMessage({message:errorMessage}));
        })
        ) // inner pipe
     })
     ) // outer pipe

 })

 loginRedirect$ = createEffect(() => {
    return this.actions$.pipe(ofType(...[loginSuccess, signupSuccess]), tap(action => {
        this.store.dispatch(setErrorMessage({message:''}))
        if(action.redirect){
            this.router.navigate(['/dashboard'])
        }
        
    })
    ); 
 },
  {dispatch: false }
 );


 signUp$ = createEffect(() => {
     return this.actions$.pipe(ofType(signupStart), exhaustMap(action => {
        return this._authService.signUp(action.email, action.password).pipe(map((data) => {
            this.store.dispatch(setLoadingSpinner({status:false}));
            this.store.dispatch(setErrorMessage({message:''}));
            const user = this._authService.authenticateUser(data.email, data.localId, data.idToken, data.expiresIn);
            //this._authService.autoSignIn();
            return signupSuccess({ user, redirect:true});
        }),
        catchError(errResp => {
            this.store.dispatch(setLoadingSpinner({status:false}));
            const errorMessage = this._authService.errorMsgs(errResp.error.error.message);
            return of(setErrorMessage({message: errorMessage}));
        })
        )
     })
     )
 })


 autoLogin$ = createEffect(() => {
     return this.actions$.pipe(ofType(autoLogin), mergeMap((action) => {
         //debugger;
         const user = this._authService.autoSignIn();
         return of(loginSuccess({user , redirect:false}));
     })
     )
 },
 )


 logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(autoLogout),
        tap(() => {
           // debugger;
          this._authService.signOut();
          this.router.navigate(['login']);
        })
      );
    },
    { dispatch: false }
  );

}