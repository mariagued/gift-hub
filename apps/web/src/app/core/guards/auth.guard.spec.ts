import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { SupabaseService } from '../services/supabase.service';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let mockSupabaseService: any;
  let mockRouter: any;
  let currentUserSignal: any;

  beforeEach(() => {
    currentUserSignal = signal<any>(null);
    mockSupabaseService = {
      currentUser: jest.fn().mockReturnValue(currentUserSignal)
    };
    mockRouter = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SupabaseService, useValue: mockSupabaseService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect to /login if user is not authenticated and local storage is empty', () => {
    currentUserSignal.set(null);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should allow access if user signal is authenticated', () => {
    currentUserSignal.set({ email: 'test@example.com' });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should allow access if user is in localStorage even if signal is empty', () => {
    currentUserSignal.set(null);
    localStorage.setItem('currentUser', JSON.stringify({ email: 'test@example.com' }));
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
