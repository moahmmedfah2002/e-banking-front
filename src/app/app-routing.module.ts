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
import {AdminUsersComponent} from './admin/admin-users/admin-users.component';
import {AdminlayoutComponent} from './adminlayout/adminlayout.component';
  import { AgentLayoutComponent } from './agent/agent-layout/agent-layout.component';
import { AgentClientComponent } from './agent/agent-client/agent-client.component';
import { AdminSubAdminComponent } from './admin/admin-sub-admin/admin-sub-admin.component';
import { CryptoHistoryComponent } from './agent/crypto-history/crypto-history.component';
import { AccountAgentComponent } from './agent/account-agent/account-agent.component';
import { TransactionAgentComponent } from './agent/transaction-agent/transaction-agent.component';
import { ChatBotComponent } from './chatbot/chatbot.component';
import { AgentManagementPageComponent } from './agent-management-page/agent-management-page.component';
import {LogupComponent} from './logup/logup.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '2FA', component: Auth2faComponent },
  {path: 'logup', component: LogupComponent },

  // Authenticated routes (with layout)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'transaction', component: TransactionPageComponent },
      { path: 'account', component: AccountComponent },
      { path: 'crypto', component: CryptoPageComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
  ,  {
    path: 'admin',
    component: AdminlayoutComponent,
    children: [
      { path: 'users', component: AdminUsersComponent },
      { path: 'admins', component: AdminSubAdminComponent},
      { path: 'agent-management', component: AgentManagementPageComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },
  {
    path: 'agent',
    component: AgentLayoutComponent,
    children: [
      {path: 'clients', component: AgentClientComponent},
      {path: 'crypto', component: CryptoHistoryComponent},
      {path: 'accounts', component: AccountAgentComponent},
      {path: 'transactions', component: TransactionAgentComponent},
      {path: '', redirectTo: 'clients', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
