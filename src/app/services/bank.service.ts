import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Bank } from '../modele/Bank';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = `${environment.apiUrl}/api/banks`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  // Mock banks for fallback during development/testing
  private mockBanks: Bank[] = [
    {
      id: '1',
      name: 'First Bank',
      address: '123 Banking St.',
      phone: '555-111-2222',
      email: 'contact@firstbank.com',
      status: 'Active',
      agents: []
    },
    {
      id: '2',
      name: 'Second Bank',
      address: '456 Finance Ave.',
      phone: '555-333-4444',
      email: 'contact@secondbank.com',
      status: 'Active',
      agents: []
    },
    {
      id: '3',
      name: 'Third Bank',
      address: '789 Money Rd.',
      phone: '555-555-6666',
      email: 'contact@thirdbank.com',
      status: 'Active',
      agents: []
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Handle HTTP operation errors
   */
  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Let the app continue by returning a fallback value or re-throwing the error
      return throwError(() => error);
    };
  }

  /**
   * GET all banks from the API, fallback to mock data on error
   */
  getAllBanks(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.apiUrl).pipe(
      tap(banks => console.log(`Fetched ${banks.length} banks`)),
      catchError(error => {
        console.warn('Using mock bank data due to API error:', error.message);
        return of(this.mockBanks);
      })
    );
  }

  /**
   * GET bank by id from the API, fallback to mock data on error
   */
  getBankById(id: string): Observable<Bank | undefined> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Bank>(url).pipe(
      tap(bank => console.log(`Fetched bank id=${id}`)),
      catchError(error => {
        console.warn(`Using mock bank data for id=${id} due to API error:`, error.message);
        return of(this.mockBanks.find(bank => bank.id === id));
      })
    );
  }
}
