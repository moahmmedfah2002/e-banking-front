import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViremntService {
  public http:HttpClient=inject(HttpClient);

  viremntStrip(accountNumberSource:any,amount:any) {
    let token = sessionStorage.getItem("authToken");
    return this.http.get<boolean>("http://127.0.0.1:8082/virement/sendStip", {
      params: {
        accountNumberSource: accountNumberSource,
        amount: amount
      },headers:{authorization:`Bearer ${token}` }
    }).subscribe();
  }


  viremntAccount(accountReciver:any,accountDebit:any,amount:any,motif:any) {
    let token = sessionStorage.getItem("authToken");
    return this.http.get<string>("http://127.0.0.1:8082/virement/sendStip", {
      params: {
        accountReciver: accountReciver,
        accountDebit: accountDebit,
        amount: amount,
        motif:motif
      },headers:{authorization:`Bearer ${token}` }
    });
  }



}
