import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { RegisterComponent } from './register.component';
import { SupabaseService } from '../../../core/services/supabase.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockSupabaseService = {
    currentUser: () => signal(null).asReadonly(),
    signUp: jest.fn().mockResolvedValue({ data: { user: {} } }),
    signIn: jest.fn().mockResolvedValue({ data: { user: {} } }),
    signOut: jest.fn().mockResolvedValue({})
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

