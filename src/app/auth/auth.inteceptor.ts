import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { getToken } from "../state/auth.selector";
import { AppState } from "../store/app.state";


@Injectable()
export class AuthInterceptor implements  HttpInterceptor{
   
  constructor( private store:Store<AppState>){}

    intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
    
        

        return this.store.select(getToken).pipe(
            take(1),
            exhaustMap((token) =>{
                if(!token){
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                   params: req.params.append('auth', token)
                })
                return next.handle(modifiedReq);
            })
            )
        
    }
}