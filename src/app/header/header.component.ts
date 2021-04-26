import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private _authService:AuthserviceService ) { }
  isLoggedIn:boolean
  ngOnInit() {
  
    this._authService.user.subscribe(res =>{
      
      // if(res){
      //   this.isLoggedIn = true;
      // }
      // else{
      //   this.isLoggedIn = false
      // }
  
      this.isLoggedIn = !res ? false:true;
  
      //this.isLoggedIn = !!res; //same way for user log or not

    })
  } // ngOnInit

  onSignOut(){
    this._authService.signOut();
   }



  

}
