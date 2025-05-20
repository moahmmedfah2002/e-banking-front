import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccountComponent} from './Account/account.component';
import {LoginComponent} from './login/login.component';
import {HomePageComponent} from './home/home-page/home-page.component';

const routes: Routes = [
  {path:"account", component:AccountComponent},
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'home',component:HomePageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
