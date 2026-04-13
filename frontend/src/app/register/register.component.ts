import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="card auth-card">
        <div class="auth-header">
          <img src="/assets/logo.png" alt="Scizzor Logo" class="logo-img">
          <h2>Crie sua conta</h2>
        </div>
        
        <form (ngSubmit)="onSubmit()">
          <label for="name">Nome do Estabelecimento</label>
          <input type="text" id="name" [(ngModel)]="name" name="name" required>

          <label for="username">Username exclusivo (ex: \@meusalao)</label>
          <input type="text" id="username" [(ngModel)]="username" name="username" required>
          
          <label for="email">E-mail</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required>
          
          <label for="password">Senha</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" style="width: 100%">Cadastrar</button>
        </form>
        
        <div class="auth-footer">
          <p>Já possui conta? <a routerLink="/login">Entrar</a></p>
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
      padding: 40px 0;
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
  `]
})
export class RegisterComponent {
  name = '';
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    this.api.register({ 
      name: this.name, 
      username: this.username, 
      email: this.email, 
      password: this.password 
    }).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso! Faça login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Erro: ' + (err.error?.message || 'Não foi possível cadastrar');
      }
    });
  }
}
