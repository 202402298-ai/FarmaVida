import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { ProductosComponent } from './components/productos/productos';
import { ProveedoresComponent } from './components/proveedores/proveedores';
import { CategoriasComponent } from './components/categorias/categorias';
import { OrdenesComponent } from './components/ordenes/ordenes';
import { UsuariosComponent } from './components/usuarios/usuarios';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback';

export const routes: Routes = [
  { path: '',            redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',       component: LoginComponent },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'dashboard',   component: DashboardComponent,   canActivate: [authGuard] },
  { path: 'productos',   component: ProductosComponent,   canActivate: [authGuard] },
  { path: 'proveedores', component: ProveedoresComponent, canActivate: [authGuard] },
  { path: 'categorias',  component: CategoriasComponent,  canActivate: [authGuard] },
  { path: 'ordenes',     component: OrdenesComponent,     canActivate: [authGuard] },
  { path: 'usuarios',    component: UsuariosComponent,    canActivate: [authGuard] },
  { path: '**',          redirectTo: 'login' }
];