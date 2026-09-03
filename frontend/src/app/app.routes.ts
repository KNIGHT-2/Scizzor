import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientLoginComponent } from './client/client-login.component';
import { ClientRegisterComponent } from './client/client-register.component';
import { ClientDashboardComponent } from './client/client-dashboard.component';
import { PublicSalonComponent } from './public-salon/public-salon.component';
import { clientGuard, salonGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },

  // Rotas de Salão (Parceiro)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [salonGuard] },

  // Rotas de Cliente Final
  { path: 'client/login', component: ClientLoginComponent },
  { path: 'client/register', component: ClientRegisterComponent },
  { path: 'client/dashboard', component: ClientDashboardComponent, canActivate: [clientGuard] },

  // Perfil Público da Barbearia
  { path: '@:username', component: PublicSalonComponent },
  { path: 'salon/@:username', component: PublicSalonComponent },

  { path: '**', redirectTo: '' }
];
