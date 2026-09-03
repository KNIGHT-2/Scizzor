import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="card auth-card">
        <div class="auth-header">
          <img src="/assets/logo.png" alt="Scizzor Logo" class="logo-img">
          <span class="role-badge">Área do Cliente</span>
          <h2>Acesse sua conta</h2>
        </div>
        
        <form (ngSubmit)="onSubmit()">
          <label for="email">E-mail</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required placeholder="seu@email.com">
          
          <label for="password">Senha</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required placeholder="••••••••">
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" [disabled]="isLoading" style="width: 100%">
            {{ isLoading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Ainda não tem conta? <a [routerLink]="['/client/register']" [queryParams]="returnUrl ? { returnUrl: returnUrl } : null">Cadastre-se</a></p>
          <div class="divider"></div>
          <p><a routerLink="/login" class="partner-link">É proprietário de salão? Acesse aqui</a></p>
          <p><a routerLink="/">Voltar para o Início</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #fcfcfc;
      padding: 24px;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .role-badge {
      display: inline-block;
      margin-top: 12px;
      margin-bottom: 8px;
      background: #000;
      color: #fff;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 10px;
      border-radius: 20px;
    }
    .auth-header h2 {
      margin-top: 8px;
      font-size: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .error-msg {
      color: #d32f2f;
      font-size: 0.9rem;
      margin-bottom: 16px;
    }
    .auth-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.9rem;
    }
    .auth-footer p {
      margin-bottom: 8px;
    }
    .divider {
      height: 1px;
      background: #eee;
      margin: 16px 0;
    }
    .partner-link {
      color: #555;
      font-weight: 500;
    }
  `]
})
export class ClientLoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  isLoading = false;
  returnUrl: string | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
  }

  onSubmit() {
    this.error = '';
    this.isLoading = true;

    this.api.loginClient({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.api.setSession({
          token: res.token,
          role: res.role,
          name: res.name,
          email: res.email
        });

        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(['/client/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Falha no login. Verifique suas credenciais.';
      }
    });
  }
}
