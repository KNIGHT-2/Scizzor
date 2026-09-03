import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="card auth-card">
        <div class="auth-header">
          <img src="/assets/logo.png" alt="Scizzor Logo" class="logo-img">
          <span class="role-badge">Área do Cliente</span>
          <h2 *ngIf="!isSuccess">Crie sua conta</h2>
          <h2 *ngIf="isSuccess">Sucesso!</h2>
        </div>
        
        <form *ngIf="!isSuccess" (ngSubmit)="onSubmit()">
          <label for="name">Nome Completo</label>
          <input type="text" id="name" [(ngModel)]="name" name="name" required placeholder="Seu nome">

          <label for="email">E-mail</label>
          <input type="email" id="email" [(ngModel)]="email" name="email" required placeholder="seu@email.com">

          <label for="phone">Telefone / WhatsApp</label>
          <input type="tel" id="phone" [(ngModel)]="phone" name="phone" required placeholder="(00) 00000-0000">
          
          <label for="password">Senha</label>
          <input type="password" id="password" [(ngModel)]="password" name="password" required placeholder="Mínimo 6 caracteres">
          
          <div *ngIf="error" class="error-msg">{{ error }}</div>
          
          <button type="submit" [disabled]="isLoading" style="width: 100%">
            {{ isLoading ? 'Cadastrando...' : 'Criar Conta de Cliente' }}
          </button>
        </form>

        <div *ngIf="isSuccess" class="success-container">
          <div class="success-icon">✓</div>
          <p>Cadastro realizado com sucesso!</p>
          <p class="sub-text">Você já pode fazer login para agendar seus horários.</p>
          <button [routerLink]="['/client/login']" [queryParams]="returnUrl ? { returnUrl: returnUrl } : null" style="width: 100%; margin-top: 24px;">
            Fazer Login
          </button>
        </div>
        
        <div class="auth-footer" *ngIf="!isSuccess">
          <p>Já possui conta? <a [routerLink]="['/client/login']" [queryParams]="returnUrl ? { returnUrl: returnUrl } : null">Entrar</a></p>
          <div class="divider"></div>
          <p><a routerLink="/register" class="partner-link">Quer cadastrar seu salão? Clique aqui</a></p>
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
      padding: 32px 20px;
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
    .success-container {
      text-align: center;
      animation: fadeIn 0.4s ease-out;
    }
    .success-icon {
      font-size: 3rem;
      color: #000;
      margin-bottom: 12px;
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
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ClientRegisterComponent implements OnInit {
  name = '';
  email = '';
  phone = '';
  password = '';
  error = '';
  isSuccess = false;
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

    if (!this.name || !this.email || !this.phone || !this.password) {
      this.error = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    this.isLoading = true;

    this.api.registerClient({
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Erro ao realizar cadastro. Verifique os dados.';
      }
    });
  }
}
