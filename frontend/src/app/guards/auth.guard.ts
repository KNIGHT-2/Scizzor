import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../api.service';

export const salonGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiService);
  const router = inject(Router);

  if (api.isLoggedIn() && api.isSalon()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const clientGuard: CanActivateFn = (route, state) => {
  const api = inject(ApiService);
  const router = inject(Router);

  if (api.isLoggedIn() && api.isClient()) {
    return true;
  }

  router.navigate(['/client/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
