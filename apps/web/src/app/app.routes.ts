import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'como-funciona', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/como-funciona.component').then(m => m.ComoFuncionaComponent) },
  { path: 'groups', canActivate: [authGuard], loadComponent: () => import('./features/groups/groups.component').then(m => m.GroupsComponent) },
  { path: 'groups/new', canActivate: [authGuard], loadComponent: () => import('./features/groups/create-group.component').then(m => m.CreateGroupComponent) },
  { path: 'groups/:id/edit', canActivate: [authGuard], loadComponent: () => import('./features/groups/create-group.component').then(m => m.CreateGroupComponent) },
  { path: 'groups/:id', canActivate: [authGuard], loadComponent: () => import('./features/groups/group-details.component').then(m => m.GroupDetailsComponent) },
  { path: 'groups/:id/revelacao', canActivate: [authGuard], loadComponent: () => import('./features/groups/revelation.component').then(m => m.RevelationComponent) },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) }
];

