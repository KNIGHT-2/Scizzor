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
          <h2 *ngIf="!isSuccess">Crie sua conta</h2>
          <h2 *ngIf="isSuccess">Sucesso!</h2>
        </div>
        
        <form *ngIf="!isSuccess" (ngSubmit)="onSubmit()">
          <label for="name">Nome do Estabelecimento</label>
          <input type="text" id="name" [(ngModel)]="name" name="name" required>

          <label for="username">Username exclusivo</label>
          <div class="username-input-wrapper">
            <span class="user-prefix">@</span>
            <input type="text" id="username" [(ngModel)]="username" name="username" required placeholder="meusalao">
          </div>
          
          <label for="email">E-mail</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required>
          
          <label for="password">Senha</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required>
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" style="width: 100%">Cadastrar</button>
        </form>

        <div *ngIf="isSuccess" class="success-container">
          <div class="success-icon">✓</div>
          <p>Cadastro realizado com sucesso!</p>
          <p class="sub-text">Agora você pode acessar sua conta.</p>
          <button routerLink="/login" style="width: 100%; margin-top: 24px;">Ir para Login</button>
        </div>
        
        <div class="auth-footer" *ngIf="!isSuccess">
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
    .success-container {
      text-align: center;
      animation: fadeIn 0.5s ease-out;
    }
    .success-icon {
      font-size: 3rem;
      color: #000;
      margin-bottom: 16px;
    }
    .success-container p {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .sub-text {
      color: #666;
      font-weight: 400 !important;
      font-size: 0.9rem !important;
      margin-top: 8px;
    }
    .auth-footer {
      margin-top: 24px;
      text-align: center;
      font-size: 0.9rem;
    }
    .username-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    .user-prefix {
      position: absolute;
      left: 12px;
      color: #999;
      font-weight: 600;
      pointer-events: none;
      /* Ajuste fino para alinhar com o texto do input */
      line-height: normal;
    }
    .username-input-wrapper input {
      padding-left: 32px !important;
      margin-bottom: 0 !important;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RegisterComponent {
  name = '';
  username = '';
  email = '';
  password = '';
  error = '';
  isSuccess = false;

  constructor(private api: ApiService, private router: Router) {}

  onSubmit() {
    // Remove o "@" se o usuário tiver digitado, para salvar apenas o username limpo
    const cleanUsername = this.username.startsWith('@') ? this.username.substring(1) : this.username;
    
    this.api.register({ 
      name: this.name, 
      username: cleanUsername, 
      email: this.email, 
      password: this.password 
    }).subscribe({
      next: () => {
        this.isSuccess = true;
      },
      error: (err) => {
        this.error = 'Erro: ' + (err.error?.message || 'Não foi possível cadastrar');
      }
    });
  }
}
