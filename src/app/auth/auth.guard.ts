import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { isAuthenticated } from '../state/auth.selector';
import { AppState } from '../store/app.state';

import { AuthserviceService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _authService:AuthserviceService, private router:Router, private store:Store<AppState>){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(isAuthenticated).pipe(
      take(1),
      map(user => {
       if(user){
         return true;
       }
        return this.router.createUrlTree(['']);
      })
    )
      
    //return true;
  }
  
}
