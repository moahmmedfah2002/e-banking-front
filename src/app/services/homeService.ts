import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../modele/User';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {

  }
  getUser(token: string) {
    return this.http.post<User>("http://localhost:8081/auth/isAuth",{},{headers:{Authorization:`Bearer ${token}`}, params:{token: String(token)}});
  }

}
