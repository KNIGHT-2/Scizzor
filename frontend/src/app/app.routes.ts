import { Routes, UrlMatcher, UrlSegment } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientLoginComponent } from './client/client-login.component';
import { ClientRegisterComponent } from './client/client-register.component';
import { ClientDashboardComponent } from './client/client-dashboard.component';
import { PublicSalonComponent } from './public-salon/public-salon.component';
import { clientGuard, salonGuard } from './guards/auth.guard';

// Matcher para rotas do tipo /@{username}
export const publicProfileMatcher: UrlMatcher = (segments: UrlSegment[]) => {
  if (segments.length === 1 && segments[0].path.startsWith('@') && segments[0].path.length > 1) {
    return {
      consumed: segments,
      posParams: {
        username: new UrlSegment(segments[0].path.substring(1), {})
      }
    };
  }
  return null;
};

// Matcher para rotas do tipo /salon/@{username} ou /salon/{username}
export const salonProfileMatcher: UrlMatcher = (segments: UrlSegment[]) => {
  if (segments.length === 2 && segments[0].path === 'salon' && segments[1].path.length > 0) {
    const rawUser = segments[1].path;
    const cleanUser = rawUser.startsWith('@') ? rawUser.substring(1) : rawUser;
    return {
      consumed: segments,
      posParams: {
        username: new UrlSegment(cleanUser, {})
      }
    };
  }
  return null;
};

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
  { matcher: publicProfileMatcher, component: PublicSalonComponent },
  { matcher: salonProfileMatcher, component: PublicSalonComponent },
  { path: 'salon/:username', component: PublicSalonComponent },

  { path: '**', redirectTo: '' }
];
