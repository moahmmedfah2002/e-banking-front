import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentDashboardService {
  private apiUrl = `${environment.apiUrl}/agent/dashboard`;

  constructor(private http: HttpClient) { }

  /**
   * Get summary statistics for the agent dashboard
   * @returns Observable with dashboard summary data
   */
  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  /**
   * Get performance metrics for the agent
   * @param period The time period (e.g., '7d', '30d', '90d', '1y')
   * @returns Observable with performance metrics
   */
  getPerformanceMetrics(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/performance`, { params: { period } });
  }

  /**
   * Get client acquisition metrics
   * @param period The time period (e.g., '7d', '30d', '90d', '1y')
   * @returns Observable with client acquisition data
   */
  getClientAcquisitionMetrics(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/client-acquisition`, { params: { period } });
  }

  /**
   * Get transaction volume metrics
   * @param period The time period (e.g., '7d', '30d', '90d', '1y')
   * @returns Observable with transaction volume data
   */
  getTransactionVolumeMetrics(period: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/transaction-volume`, { params: { period } });
  }

  /**
   * Get alerts and notifications for the agent
   * @returns Observable with alerts and notifications
   */
  getAgentAlerts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/alerts`);
  }

  /**
   * Get task list for the agent
   * @returns Observable with tasks
   */
  getAgentTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tasks`);
  }
}
