import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    if (!this.apiUrl) {
      // Generate some mock admin users
      const mockAdmins: User[] = [
        {
          id: 1,
          nom: 'Admin',
          prenom: 'Super',
          email: 'super.admin@ebanking.com',
          telephone: '+1234567890',
          identifiant: 'superadmin',
          role: Role.ADMIN,
          estActif: true,
          dateCreation: new Date('2023-01-01')
        },
        {
          id: 2,
          nom: 'Admin',
          prenom: 'Regular',
          email: 'regular.admin@ebanking.com',
          telephone: '+1234567891',
          identifiant: 'regadmin',
          role: Role.ADMIN,
          estActif: true,
          dateCreation: new Date('2023-02-15')
        },
        {
          id: 3,
          nom: 'Admin',
          prenom: 'System',
          email: 'system.admin@ebanking.com',
          telephone: '+1234567892',
          identifiant: 'sysadmin',
          role: Role.ADMIN,
          estActif: true,
          dateCreation: new Date('2023-03-10')
        },
        {
          id: 4,
          nom: 'Admin',
          prenom: 'Network',
          email: 'network.admin@ebanking.com',
          telephone: '+1234567893',
          identifiant: 'netadmin',
          role: Role.ADMIN,
          estActif: true,
          dateCreation: new Date('2023-04-05')
        },
        {
          id: 5,
          nom: 'Admin',
          prenom: 'Inactive',
          email: 'inactive.admin@ebanking.com',
          telephone: '+1234567894',
          identifiant: 'inactiveadmin',
          role: Role.ADMIN,
          estActif: false,
          dateCreation: new Date('2023-05-20')
        }
      ];
      
      let filteredAdmins = [...mockAdmins];
      
      if (filters) {
        // Apply filters to mock data
        if (filters.status) {
          filteredAdmins = filteredAdmins.filter(admin => {
            if (filters.status === 'active') return admin.estActif === true;
            if (filters.status === 'inactive') return admin.estActif === false;
            return true;
          });
        }
        
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredAdmins = filteredAdmins.filter(admin => 
            admin.nom?.toLowerCase().includes(searchLower) || 
            admin.prenom?.toLowerCase().includes(searchLower) || 
            admin.email?.toLowerCase().includes(searchLower)
          );
        }
        
        // Add pagination
        if (filters.page !== undefined && filters.pageSize !== undefined) {
          const startIndex = filters.page * filters.pageSize;
          filteredAdmins = filteredAdmins.slice(startIndex, startIndex + filters.pageSize);
        }
      }
      
      return of(filteredAdmins);
    }
    
    // Build query parameters
    let params = new HttpParams();
    if (filters) {
      if (filters.role) params = params.append('role', filters.role);
      if (filters.status) params = params.append('status', filters.status);
      if (filters.searchTerm) params = params.append('search', filters.searchTerm);
      if (filters.page !== undefined) params = params.append('page', filters.page.toString());
      if (filters.pageSize !== undefined) params = params.append('size', filters.pageSize.toString());
    }
    
    return this.http.get<User[]>(url, { params }).pipe(
      catchError(this.handleError<User[]>('getAdmins', []))
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
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
