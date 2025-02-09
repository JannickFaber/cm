import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token && route.routeConfig?.path !== '') {
    router.navigate(['/']);
    return false;
  }

   if (token && route.routeConfig?.path === '') {

    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};