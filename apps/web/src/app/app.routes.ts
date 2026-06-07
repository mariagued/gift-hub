import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'como-funciona', loadComponent: () => import('./features/dashboard/como-funciona.component').then(m => m.ComoFuncionaComponent) },
  { path: 'groups', loadComponent: () => import('./features/groups/groups.component').then(m => m.GroupsComponent) },
  { path: 'groups/new', loadComponent: () => import('./features/groups/create-group.component').then(m => m.CreateGroupComponent) },
  { path: 'groups/:id', loadComponent: () => import('./features/groups/group-details.component').then(m => m.GroupDetailsComponent) },
  { path: 'groups/:id/revelacao', loadComponent: () => import('./features/groups/revelation.component').then(m => m.RevelationComponent) },
  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) }
];
