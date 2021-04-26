import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _authService:AuthserviceService){}

  ngOnInit(){
    this._authService.autoSignIn();    
  }
}
