import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { autoLogout } from '../state/auth.actions';
import { isAuthenticated } from '../state/auth.selector';
import { AppState } from '../store/app.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isAuthenticated: Observable<boolean>;
  constructor( private store: Store<AppState> ) { }
  isLoggedIn:boolean
  ngOnInit() {
  
    // this._authService.user.subscribe(res =>{
      
    //   // if(res){
    //   //   this.isLoggedIn = true;
    //   // }
    //   // else{
    //   //   this.isLoggedIn = false
    //   // }
  
    //   this.isLoggedIn = !res ? false:true;
  
    //   //this.isLoggedIn = !!res; //same way for user log or not

    // })
  this.isAuthenticated = this.store.select(isAuthenticated)


  } // ngOnInit

  onSignOut(){
    //this._authService.signOut();
    this.store.dispatch(autoLogout())
   }



  

}
