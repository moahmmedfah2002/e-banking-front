import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Respense} from '../modele/Respense';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViremntService {
  public http:HttpClient=inject(HttpClient);

  viremntStrip(accountNumberSource:any,amount:any) {
    let token = sessionStorage.getItem("authToken");
    return this.http.get<boolean>(`${environment.apiUrl}/virement/sendStip`, {
      params: {
        accountNumberSource: accountNumberSource,
        amount: amount
      },headers:{authorization:`Bearer ${token}` }
    }).subscribe();
  }


  viremntAccount(accountReciver:any,accountDebit:any,amount:any,motif:any) {
    let token = sessionStorage.getItem("authToken");
    return this.http.get<Respense>(`${environment.apiUrl}/virement/sendAccount`, {
      params: {
        accountReciver: accountReciver,
        accountDebit: accountDebit,
        amount: amount,
        motif:motif
      },headers:{authorization:`Bearer ${token}` }
    });
  }



}
