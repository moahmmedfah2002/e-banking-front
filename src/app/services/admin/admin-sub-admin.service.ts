import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../modele/User';
import { Role } from '../../modele/Role';

export interface AdminStats {
  totalAdmins: number;
  totalIncrease: number;
  activeAdmins: number;
  activeIncrease: number;
  superAdmins: number;
  superAdminsChange: string;
  inactiveAccounts: number;
  inactiveIncrease: number;
}

export interface AdminFilters {
  role?: string;
  status?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminSubAdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }



  getAdmins(filters?: AdminFilters): Observable<User[]> {
    let url = `${this.apiUrl}/api/admins`;
    
    // Return mock data if apiUrl is null (for development)
    
    return this.http.get<User[]>(url).pipe(
      map(response => response as User[])
      , catchError(this.handleError<User[]>('getAdmins', []))
    );
  }

  getAdminById(id: number): Observable<User> {
    const url = `${this.apiUrl}/api/admins/${id}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      const mockAdmin = {
        id: id,
        nom: 'Admin',
        prenom: id === 1 ? 'Super' : 'Regular',
        email: `admin${id}@ebanking.com`,
        telephone: `+123456789${id}`,
        identifiant: `admin${id}`,
        role: Role.ADMIN,
        estActif: true,
        dateCreation: new Date()
      };
      return of(mockAdmin);
    }
    
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>('getAdminById', new User()))
    );
  }

  createAdmin(admin: User): Observable<User> {
    const url = `${this.apiUrl}/api/admins`;
    
    // For creation, ensure the role is set to ADMIN
    admin.role = Role.ADMIN;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      admin.id = Math.floor(Math.random() * 1000) + 6; // Assign a random ID > 5
      return of(admin);
    }
    
    return this.http.post<User>(url, admin).pipe(
      catchError(this.handleError<User>('createAdmin', admin))
    );
  }

  updateAdmin(admin: User): Observable<User> {
    const url = `${this.apiUrl}/api/admins/${admin.id}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      return of(admin);
    }
    
    return this.http.put<User>(url, admin).pipe(
      catchError(this.handleError<User>('updateAdmin', admin))
    );
  }

  deleteAdmin(id: number): Observable<void> {
    const url = `${this.apiUrl}/api/admins/${id}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      return of(undefined);
    }
    
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError<void>('deleteAdmin'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${JSON.stringify(error)}`);
      
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
