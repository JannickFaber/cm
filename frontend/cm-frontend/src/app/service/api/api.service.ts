import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseURL = 'http://127.0.0.1:8000';

  private http = inject(HttpClient);

  requestToken(username: string, password: string): Observable<any> {

    const body = new HttpParams()
    .set('username', username)
    .set('password', password);

    return this.http.post(this.baseURL + '/login', body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    });
  }

  requestData(): Observable<any> {
    return this.http.get(this.baseURL + '/data');
  }
}
