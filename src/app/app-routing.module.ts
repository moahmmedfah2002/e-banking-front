import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccountComponent} from './Account/account.component';
import {LoginComponent} from './login/login.component';
import {HomePageComponent} from './home/home-page/home-page.component';
import {Auth2faComponent} from './auth2fa/auth2fa.component';
import {TransactionPageComponent} from './transaction/transaction-page/transaction-page.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {CryptoPageComponent} from './crypto-page/crypto-page.component';
import {SidebarAdminComponent} from './sidebar-admin/sidebar-admin.component';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component';
import {AdminUsersComponent} from './admin/admin-users/admin-users.component';
import {AdminBanksComponent} from './admin/admin-banks/admin-banks.component';
import {AdminlayoutComponent} from './adminlayout/adminlayout.component';
import {CardManagementComponent} from './card-management/card-management.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '2FA', component: Auth2faComponent },
  
  // Authenticated routes (with layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'transaction', component: TransactionPageComponent },
      { path: 'account', component: AccountComponent },
      { path: 'crypto', component: CryptoPageComponent },
      { path: 'card', component: CardManagementComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
  ,
  {
    path: 'admin',
    component: AdminlayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'banks', component: AdminBanksComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
