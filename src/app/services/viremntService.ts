import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViremntService {
  public http:HttpClient=inject(HttpClient);
  viremnt(accountNumberSource:any,amount:any) {
    return this.http.get<boolean>("http://127.0.0.1:8082/virement/send", {
      params: {
        accountNumberSource: accountNumberSource,
        amount: amount
      },headers:{authorization:"Bearer "+localStorage.getItem("token") }
    });
  }



}
