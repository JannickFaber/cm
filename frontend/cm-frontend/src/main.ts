import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { AppComponent } from './app/app.component';

const routes: Route[] = [
  { path: '', component: AppComponent }, // Startseite
  { path: 'login', loadComponent: () => import('./app/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./app/dashboard/dashboard.component').then(m => m.DashboardComponent) }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
