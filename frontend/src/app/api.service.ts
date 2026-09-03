import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Auth - Salon
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  // Auth - Client
  loginClient(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/client/login`, credentials);
  }

  registerClient(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/client/register`, data);
  }

  // Public Catalog & Salon Profile
  getPublicSalon(username: string): Observable<any> {
    const clean = username.startsWith('@') ? username : `@${username}`;
    return this.http.get(`${this.apiUrl}/public/salons/${clean}`);
  }

  getPublicServices(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/services?username=${username}`);
  }

  getPublicProducts(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products?username=${username}`);
  }

  // Client Profile
  getClientProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client/profile`, { headers: this.getAuthHeaders() });
  }

  // Session Helpers
  setSession(authData: { token: string, role: string, name?: string, username?: string, email?: string }): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('role', authData.role);
    if (authData.name) localStorage.setItem('name', authData.name);
    if (authData.username) localStorage.setItem('username', authData.username);
    if (authData.email) localStorage.setItem('email', authData.email);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUserName(): string | null {
    return localStorage.getItem('name');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isSalon(): boolean {
    return this.getRole() === 'ROLE_SALON';
  }

  isClient(): boolean {
    return this.getRole() === 'ROLE_CLIENT';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  // Services
  getServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services`, { headers: this.getAuthHeaders() });
  }

  createService(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/services`, data, { headers: this.getAuthHeaders() });
  }

  updateService(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/services/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/services/${id}`, { headers: this.getAuthHeaders() });
  }

  // Products
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`, { headers: this.getAuthHeaders() });
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, data, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`, { headers: this.getAuthHeaders() });
  }

  // Profile
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile`, data, { headers: this.getAuthHeaders() });
  }

  // Sales
  getSales(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales`, { headers: this.getAuthHeaders() });
  }

  createSale(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sales`, data, { headers: this.getAuthHeaders() });
  }

  revertLastSale(type: string, itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sales/revert/${type}/${itemId}`, { headers: this.getAuthHeaders() });
  }

  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sales/${id}`, { headers: this.getAuthHeaders() });
  }
}
