import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LoadingOverlayComponent } from "../loading-overlay/loading-overlay.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, LoadingOverlayComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  loginError: string = '';
  showOverlay = false;

  private subscription = new Subscription();
  private authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    this.showOverlay = true;
    if (this.loginForm.valid) {
      const form = this.loginForm.value;
      this.subscription.add(
        this.authService.login(form.username, form.password)
          .subscribe(success => {
            if (!success) {
              this.loginError = 'Login failed. Please check your username and password.'
            }
            this.showOverlay = false;
          }));
    }
  }
}
