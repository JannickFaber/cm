import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './app/guards/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

const routes: Route[] = [
  { path: '', component: AppComponent },
  {
    path: 'login',
    loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./app/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule)
  ]
});
