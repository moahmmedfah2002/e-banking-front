import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { MainContentComponent } from './home/main-content/main-content.component';
import { AcountSummaryCardComponent } from './home/acount-summary-card/acount-summary-card.component';
import { TransactionHistoryComponent } from './home/transaction-history/transaction-history.component';
import { AccountInfoComponent } from './home/account-info/account-info.component';
import { CarteComponent } from './Account/component/carte/carte.component';
import { ButtonComponent } from './Account/component/button-add-transfer/button.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AccountComponent } from './Account/account.component';
import { ButtonStatement } from './Account/component/button-statement/button-statement';
import { AccountDetails } from './Account/component/details/detail.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { AgentService } from './services/agent.service';
import { HttpClientModule } from '@angular/common/http';
import { ChatBotComponent } from './chatbot/chatbot.component';
import { Auth2faComponent } from './auth2fa/auth2fa.component';
import { DatePipe } from '@angular/common';
import { TransactionPageComponent } from './transaction/transaction-page/transaction-page.component';
import { TransactionMainComponent } from './transaction/transaction-main/transaction-main.component';
import { AccountCardComponent } from './transaction/account-card/account-card.component';
import { SavingCardComponent } from './transaction/saving-card/saving-card.component';
import { CardContainerComponent } from './transaction/card-container/card-container.component';
import { RecentTransactionComponent } from './transaction/recent-transaction/recent-transaction.component';
import { TransactionFormComponent  } from './transaction/transaction-form/transaction-form.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { CryptoPageComponent } from './crypto-page/crypto-page.component';
import { CryptoTransactionModalComponent } from './crypto-page/crypto-transaction-modal/crypto-transaction-modal.component';
import { AdminTransactionComponent } from './admin/admin-banks/transaction-admin/adminTransaction.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminBanksComponent } from './admin/admin-banks/admin-banks.component';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin.component';
import { AdminlayoutComponent } from './adminlayout/adminlayout.component';
import { TransactionSummaryComponent } from './Account/component/transaction-summary/transaction-summary.component';
import { AgentComponent } from './agent/agent.component';
import { AgentLayoutComponent } from './agent/agent-layout/agent-layout.component';
import { AgentSideBarComponent } from './agent/agent-side-bar/agent-side-bar.component';
import { AgentClientComponent } from './agent/agent-client/agent-client.component';
import { AdminSubAdminComponent } from './admin/admin-sub-admin/admin-sub-admin.component';
import { TransactionAgentComponent } from './agent/transaction-agent/transaction-agent.component';
import { AccountAgentComponent } from './agent/account-agent/account-agent.component';
import { CryptoHistoryComponent } from './agent/crypto-history/crypto-history.component';
import { TransactionDetailComponent } from "./agent/transaction-agent/transaction-detail/transaction-detail.component";
import { TransactionAgentFormComponent } from './agent/transaction-agent/transaction-form/transaction-form.component';
import { AgentManagementPageComponent } from './agent-management-page/agent-management-page.component';
import {MatDialogModule} from '@angular/material/dialog';
import {PopComponent} from './transaction/pop/pop.component';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
@NgModule({
  declarations: [
    // Remove SideBarComponent from here since it's standalone
    AccountDetails,
    ButtonStatement,
    AccountComponent,
    PopComponent,
    AppComponent,
    CarteComponent,
    HomePageComponent,
    MainContentComponent,
    AcountSummaryCardComponent,
    TransactionSummaryComponent,
    TransactionHistoryComponent,
    AccountInfoComponent,
    LoginComponent,
    ButtonComponent,
    NavbarComponent,
    TransactionPageComponent,
    TransactionMainComponent,
    Auth2faComponent,
    AccountCardComponent,
    SavingCardComponent,
    CardContainerComponent,
    RecentTransactionComponent,
    TransactionFormComponent,
    SidebarComponent,
    MainLayoutComponent,
    CryptoPageComponent,
    AdminTransactionComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminBanksComponent,
    SidebarAdminComponent,
    AdminlayoutComponent,
    AgentComponent,
    AgentLayoutComponent,
    AgentSideBarComponent,
    AgentClientComponent,
    AdminSubAdminComponent,
    TransactionAgentComponent,
    AccountAgentComponent,    CryptoHistoryComponent,    TransactionAgentFormComponent,
    CryptoTransactionModalComponent,
    ChatBotComponent,
    AgentManagementPageComponent
  ], imports: [
    // Add SideBarComponent to imports since it's standalone
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,

    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    TransactionDetailComponent,
    MatButton,
  ],  providers: [
    DatePipe,
    AuthService,
    AgentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
