import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalCustomers: number;
  customerGrowth: number;
  totalTransactions: number;
  transactionGrowth: number;
  newAccounts: number;
  accountGrowth: number;
  totalRevenue: number;
  revenueGrowth: number;
}

export interface TransactionSummary {
  date: string;
  value: number;
}

export interface UserActivity {
  date: string;
  activeUsers: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    const url = `${this.apiUrl}/admin/dashboard/stats`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      return of({
        totalCustomers: 24781,
        customerGrowth: 4.3,
        totalTransactions: 1450000, // $1.45M
        transactionGrowth: 8.7,
        newAccounts: 487,
        accountGrowth: -2.1,
        totalRevenue: 892000, // $892K
        revenueGrowth: 10.2
      });
    }
    
    return this.http.get<DashboardStats>(url).pipe(
      catchError(this.handleError<DashboardStats>('getDashboardStats', {
        totalCustomers: 0,
        customerGrowth: 0,
        totalTransactions: 0,
        transactionGrowth: 0,
        newAccounts: 0,
        accountGrowth: 0,
        totalRevenue: 0,
        revenueGrowth: 0
      }))
    );
  }

  getTransactionTrends(period: string = 'week'): Observable<TransactionSummary[]> {
    const url = `${this.apiUrl}/admin/dashboard/transactions/${period}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      // Generate mock data for trends
      const mockData: TransactionSummary[] = [];
      const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 365;
      const today = new Date();
      
      for (let i = daysInPeriod - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        mockData.push({
          date: date.toISOString().split('T')[0],
          value: Math.floor(Math.random() * 100000) + 50000
        });
      }
      
      return of(mockData);
    }
    
    return this.http.get<TransactionSummary[]>(url).pipe(
      catchError(this.handleError<TransactionSummary[]>('getTransactionTrends', []))
    );
  }

  getUserActivityTrends(period: string = 'week'): Observable<UserActivity[]> {
    const url = `${this.apiUrl}/admin/dashboard/user-activity/${period}`;
    
    // Return mock data if apiUrl is null (for development)
    if (!this.apiUrl) {
      // Generate mock data for user activity
      const mockData: UserActivity[] = [];
      const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 365;
      const today = new Date();
      
      for (let i = daysInPeriod - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        mockData.push({
          date: date.toISOString().split('T')[0],
          activeUsers: Math.floor(Math.random() * 1000) + 500
        });
      }
      
      return of(mockData);
    }
    
    return this.http.get<UserActivity[]>(url).pipe(
      catchError(this.handleError<UserActivity[]>('getUserActivityTrends', []))
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
