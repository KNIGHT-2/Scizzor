import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="card auth-card">
        <div class="auth-header">
          <img src="/assets/logo.png" alt="Scizzor Logo" class="logo-img">
          <h2>Bem-vindo de volta</h2>
        </div>
        
        <form (ngSubmit)="onSubmit()">
          <label for="email">E-mail</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required>
          
          <label for="password">Senha</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" style="width: 100%">Entrar</button>
        </form>
        
        <div class="auth-footer">
          <p>Não tem uma conta? <a routerLink="/register">Cadastre-se</a></p>
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
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      padding: 40px;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-header h2 {
      margin-top: 16px;
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
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'Falha no login. Verifique suas credenciais.';
      }
    });
  }
}
