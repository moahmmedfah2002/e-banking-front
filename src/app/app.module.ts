import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { MainContentComponent } from './home/main-content/main-content.component';
import { AcountSummaryCardComponent } from './home/acount-summary-card/acount-summary-card.component';
import { TransactionHistoryComponent } from './home/transaction-history/transaction-history.component';
import { AccountInfoComponent } from './home/account-info/account-info.component';
import {CarteComponent} from './Account/component/carte/carte.component';
import { ButtonComponent } from './Account/component/button-add-transfer/button.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import {AccountComponent} from './Account/account.component';
import {ButtonStatement} from './Account/component/button-statement/button-statement';
import {AccountDetails} from './Account/component/details/detail.component';
import {LoginComponent} from './login/login.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {provideHttpClient} from '@angular/common/http';
import {SideBarComponent} from './home/side-bar/side-bar.component';
import { TransactionPageComponent } from './transaction/transaction-page/transaction-page.component';
import { TransactionMainComponent } from './transaction/transaction-main/transaction-main.component';

@NgModule({
  declarations: [
    AccountDetails,
    ButtonStatement,
    AccountComponent,
    AppComponent,
    CarteComponent,
    HomePageComponent,
    MainContentComponent,
    AcountSummaryCardComponent,
    TransactionHistoryComponent,
    AccountInfoComponent,
    LoginComponent,
    ButtonComponent,
    NavbarComponent,
    SideBarComponent,
    TransactionPageComponent,
    TransactionMainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [ provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
