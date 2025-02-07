import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, catchError, map } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private router = inject(Router);
  private apiService = inject(ApiService);

  login(username: string, password: string): Observable<boolean> {
    return this.apiService.requestToken(username, password)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.access_token);
          this.router.navigate(['/dashboard']);
          return true;
        }),
        catchError(() => of(false))
      )
  }

  logout(): void {
    localStorage.removeItem('token')
    this.router.navigate(['/login']);
  }
}
