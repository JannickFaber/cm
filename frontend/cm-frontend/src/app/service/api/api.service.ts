import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly baseURL = 'http://127.0.0.1:8000';

  private http = inject(HttpClient);

  requestToken(username: string, password: string): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/token', { username, password });
  }
  // 
  // .subscribe({
  //  next: (response: any) => {
  //    localStorage.setItem('token', response.access_token);
  //    console.log('Login erfolgreich!', response);
  //    return '';
  //  },
  //  error: (error) => {
  //    console.error('Login fehlgeschlagen', error);
  //   return 'Login fehlgeschlagen. Überprüfe Benutzername und Passwort.';
  //  }
  //});

}
