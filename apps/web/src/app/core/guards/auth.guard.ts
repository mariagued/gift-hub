import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  // If user is authenticated in SupabaseService
  if (supabaseService.currentUser()()) {
    return true;
  }

  // Fallback check in case the signals haven't synchronized yet
  if (localStorage.getItem('currentUser')) {
    return true;
  }

  // Redirect to login
  router.navigate(['/login']);
  return false;
};
