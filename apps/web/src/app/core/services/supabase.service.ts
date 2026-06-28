import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;
  private _currentUser = signal<User | null>(null);

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Initial session load
    this.client.auth.getSession().then(({ data: { session } }) => {
      this._currentUser.set(session?.user ?? null);
      if (session?.user) {
        this.syncCurrentUserToLocalStorage(session.user);
      }
    });

    // Listen for auth events
    this.client.auth.onAuthStateChange((event, session) => {
      this._currentUser.set(session?.user ?? null);
      if (session?.user) {
        this.syncCurrentUserToLocalStorage(session.user);
      } else {
        localStorage.removeItem('currentUser');
      }
    });
  }

  currentUser() {
    return this._currentUser.asReadonly();
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
