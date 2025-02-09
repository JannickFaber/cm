import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LCAData } from './lca-data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  readonly baseURL = 'https://cm-og5m.onrender.com';

  private http = inject(HttpClient);

  requestToken(username: string, password: string): Observable<any> {

    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    return this.http.post(this.baseURL + '/login', body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
  }

  requestData(): Observable<LCAData[]> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<LCAData[]>(this.baseURL + '/data', { headers });
  }
}
