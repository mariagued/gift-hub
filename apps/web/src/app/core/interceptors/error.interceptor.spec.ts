import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

describe('errorInterceptor', () => {
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect to /login and clear storage on 401 status error', () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    const errorResponse = new HttpErrorResponse({ status: 401 });
    const req = new HttpRequest('GET', '/api/data');
    const nextSpy = jest.fn().mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, nextSpy).subscribe({
        error: (err) => {
          expect(err.status).toBe(401);
        }
      });
    });

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should pass through other errors without redirecting or clearing storage', () => {
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    const errorResponse = new HttpErrorResponse({ status: 500 });
    const req = new HttpRequest('GET', '/api/data');
    const nextSpy = jest.fn().mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(req, nextSpy).subscribe({
        error: (err) => {
          expect(err.status).toBe(500);
        }
      });
    });

    expect(localStorage.getItem('currentUser')).not.toBeNull();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
