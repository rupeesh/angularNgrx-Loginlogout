import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthserviceService } from './auth/auth.service';
import { autoLogin } from './state/auth.actions';
import { AppState } from './store/app.state';
import { getErrorMessage, getLoading } from './store/shared/shared.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _authService:AuthserviceService, private store:Store<AppState>){}
  showLoading: Observable<boolean>;
  errorMessage: Observable<string>;

  ngOnInit(){
    // this._authService.autoSignIn();  
    
    this.store.dispatch(autoLogin()); 
     this.showLoading = this.store.select(getLoading)
     this.errorMessage = this.store.select(getErrorMessage)
  }

}
