import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, Subscription, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiService = inject(ApiService);

  login(username: string, password: string): Observable<string> {
    return this.apiService.requestToken(username, password)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.access_token);
          return '';
        }),
        catchError(() => 'Login fehlgeschlagen. Überprüfe Benutzername und Passwort.')
      )
  }
}
