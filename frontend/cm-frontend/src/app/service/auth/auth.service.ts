import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _$isLoggedIn = new BehaviorSubject(false);

  private router = inject(Router);
  private apiService = inject(ApiService);

  constructor() {
    const token = localStorage.getItem('token');

    this._$isLoggedIn.next(!!token);
  }

  get $isLoggedIn(): Observable<boolean> {
    return this._$isLoggedIn;
  }

  login(username: string, password: string): Observable<boolean> {
    return this.apiService.requestToken(username, password)
      .pipe(
        map(response => {
          localStorage.setItem('token', response.access_token);
          this._$isLoggedIn.next(true);
          this.router.navigate(['/dashboard']);
          return true;
        }),
        catchError(() => of(false))
      )
  }

  logout(): void {
    localStorage.removeItem('token');
    this._$isLoggedIn.next(false);
    this.router.navigate(['/']);
  }
}
