import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../modele/User';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {

  }
  getUser(token: string) {
    return this.http.post<User>(`${environment.apiUrl}/auth/isAuth`,{},{headers:{Authorization:`Bearer ${token}`}, params:{token: String(token)}});
  }

}
