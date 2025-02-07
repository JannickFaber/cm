import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiService = inject(ApiService);

  login(username: string, password: string): Subscription {
    return this.apiService.requestToken(username, password).subscribe()
  }
}
