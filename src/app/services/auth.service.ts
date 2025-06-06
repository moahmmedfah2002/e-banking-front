import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Auth} from '../modele/Auth';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    // Check initial auth state from localStorage
    const token = localStorage.getItem('authToken');
    this.isAuthenticatedSubject.next(!!token);
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post<Auth>("http://127.0.0.1:8082/auth/login", {username: email, password: password}).pipe(
      tap((response: Auth) => {
        if (response.token) {
          if (rememberMe) {
            localStorage.setItem('authToken', response.token);
          } else {
            sessionStorage.setItem('authToken', response.token);
          }
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      })
    );
  }
  logout(): void {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  auth2(otp: string) {
    return this.http.get<boolean>("http://127.0.0.1:8082/auth/validateOtp", {
      params: {
        otp: otp,
        token: String(sessionStorage.getItem("authToken"))
      }
    });
  }


}
