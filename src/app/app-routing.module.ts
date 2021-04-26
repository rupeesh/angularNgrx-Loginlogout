import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
{path:'', redirectTo:'login', pathMatch:'full'},
{path:'login', component:LoginComponent},
{path:'home', canActivate:[AuthGuard],  component:HomeComponent},
{path:'dashboard', canActivate:[AuthGuard],  component:DashboardComponent},
{path:'product',canActivate:[AuthGuard],   component:ProductComponent},


];

@NgModule({
  imports: [  
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
  