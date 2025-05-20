import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CarteComponent} from './Account/component/carte/carte.component';
import { ButtonComponent } from './Account/component/button-add-transfer/button.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import {AccountComponent} from './Account/account.component';
import {ButtonStatement} from './Account/component/button-statement/button-statement';
import {AccountDetails} from './Account/component/details/detail.component';

@NgModule({
  declarations: [
    AccountDetails,
    ButtonStatement,
    AccountComponent,
    AppComponent,
    CarteComponent,
    ButtonComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
