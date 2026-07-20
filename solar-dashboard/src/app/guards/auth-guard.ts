import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router=inject(Router);
  
  if (authService.authenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

