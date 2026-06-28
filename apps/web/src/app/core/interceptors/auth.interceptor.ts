import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;

  // Search localStorage for the Supabase session token
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('-auth-token')) {
      try {
        const val = JSON.parse(localStorage.getItem(key) || '{}');
        if (val && val.currentSession && val.currentSession.access_token) {
          token = val.currentSession.access_token;
          break;
        }
      } catch (e) {
        // ignore parsing errors
      }
    }
  }

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
