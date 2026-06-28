import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  readonly authState$ = new Observable<User | null>(subscriber => {
    // Initial session load
    this.client.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      if (user) {
        this.syncCurrentUserToLocalStorage(user);
      }
      subscriber.next(user);
    });

    // Listen for auth events
    const { data: { subscription } } = this.client.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      if (user) {
        this.syncCurrentUserToLocalStorage(user);
      } else {
        localStorage.removeItem('currentUser');
      }
      subscriber.next(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  private _currentUserSignal = toSignal(this.authState$, { initialValue: null });

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  currentUser() {
    return this._currentUserSignal;
  }

  async signUp(email: string, password: string, name: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
    if (error) throw error;

    if (data.user) {
      const { error: dbError } = await this.client
        .from('USER')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          name: name,
          avatarUrl: `https://i.pravatar.cc/150?u=${data.user.id}`
        });
      if (dbError) {
        console.error('Error inserting user to DB table:', dbError);
      }
    }
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    if (data.user) {
      this.syncCurrentUserToLocalStorage(data.user);
    }
    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('currentUser');
  }

  private syncCurrentUserToLocalStorage(user: User) {
    const name = user.user_metadata?.['name'] || user.email?.split('@')[0] || 'Usuário';
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      email: user.email,
      name: name
    }));
  }
}
