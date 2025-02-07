import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post('http://127.0.0.1:8000/token', this.loginForm.value).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.access_token);
          console.log('Login erfolgreich!', response);
          this.loginError = '';
        },
        error: (error) => {
          console.error('Login fehlgeschlagen', error);
          this.loginError = 'Login fehlgeschlagen. Überprüfe Benutzername und Passwort.';
        }
      });
    }
  }
}
