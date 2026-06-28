import { HttpRequest } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('should not add Authorization header if token is not in localStorage', () => {
    const req = new HttpRequest('GET', '/api/data');
    const nextSpy = jest.fn().mockReturnValue(of({}));

    authInterceptor(req, nextSpy);

    expect(nextSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          normalizedNames: new Map(),
          lazyUpdate: null
        })
      })
    );
  });

  it('should add Authorization header if token is in localStorage', () => {
    const mockSession = {
      currentSession: {
        access_token: 'my-super-token'
      }
    };
    localStorage.setItem('sb-xxx-auth-token', JSON.stringify(mockSession));

    const req = new HttpRequest('GET', '/api/data');
    const nextSpy = jest.fn().mockReturnValue(of({}));

    authInterceptor(req, nextSpy);

    const interceptedReq = nextSpy.mock.calls[0][0];
    expect(interceptedReq.headers.get('Authorization')).toBe('Bearer my-super-token');
  });
});
