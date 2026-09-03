import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="client-layout">
      <header class="client-header">
        <div class="container nav-container">
          <div class="brand">
            <img src="/assets/logo.png" alt="Scizzor" class="logo-img">
            <span class="role-tag">Área do Cliente</span>
          </div>
          <div class="user-menu">
            <span class="greeting">Olá, <strong>{{ clientData.name || 'Cliente' }}</strong></span>
            <button class="outline btn-sm" (click)="logout()">Sair</button>
          </div>
        </div>
      </header>

      <main class="container content">
        <!-- Profile Banner -->
        <section class="card profile-banner">
          <div class="profile-info">
            <h2>{{ clientData.name || 'Meu Perfil' }}</h2>
            <p class="contact-line">📧 {{ clientData.email }} • 📱 {{ clientData.phone }}</p>
          </div>
          <div class="search-barber">
            <label>Visitar perfil de uma barbearia:</label>
            <div class="search-input-group">
              <span class="prefix">@</span>
              <input type="text" [(ngModel)]="barberUsername" placeholder="username-da-barbearia" (keyup.enter)="goToBarber()">
              <button (click)="goToBarber()">Acessar</button>
            </div>
          </div>
        </section>

        <!-- Appointments Section -->
        <section class="appointments-section">
          <div class="section-header">
            <h3>Meus Agendamentos</h3>
            <span class="sub-label">Acompanhe seus horários marcados</span>
          </div>

          <div class="card empty-card" *ngIf="appointments.length === 0">
            <div class="empty-icon">📅</div>
            <h4>Você ainda não possui agendamentos ativos</h4>
            <p>Acesse a página pública de uma barbearia para escolher um serviço e reservar seu horário.</p>
          </div>

          <div class="appointments-list" *ngIf="appointments.length > 0">
            <div class="card appointment-card" *ngFor="let apt of appointments">
              <div class="apt-main">
                <span class="apt-badge">{{ apt.status }}</span>
                <h4>{{ apt.serviceName }}</h4>
                <p class="barber-name">Barbearia: <strong>{{ apt.salonName }}</strong></p>
              </div>
              <div class="apt-details">
                <p>Data: <strong>{{ apt.date }}</strong> às <strong>{{ apt.time }}</strong></p>
                <p class="price">R$ {{ apt.price.toFixed(2).replace('.', ',') }}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .client-layout {
      min-height: 100vh;
      background-color: #f8f8f8;
      display: flex;
      flex-direction: column;
    }
    .client-header {
      background: #fff;
      border-bottom: 1px solid #eee;
      padding: 16px 0;
    }
    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand img {
      max-width: 90px;
    }
    .role-tag {
      background: #000;
      color: #fff;
      font-size: 0.7rem;
      padding: 3px 8px;
      border-radius: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .greeting {
      font-size: 0.95rem;
      color: #444;
    }
    .btn-sm {
      padding: 6px 14px;
      font-size: 0.85rem;
      height: auto;
    }
    .content {
      padding: 40px 20px;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
    }
    .profile-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px 32px;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 20px;
    }
    .profile-info h2 {
      margin: 0 0 6px 0;
      font-size: 1.4rem;
    }
    .contact-line {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
    .search-barber label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: #666;
      margin-bottom: 6px;
    }
    .search-input-group {
      display: flex;
      align-items: center;
      position: relative;
    }
    .search-input-group .prefix {
      position: absolute;
      left: 10px;
      color: #999;
      font-weight: 600;
    }
    .search-input-group input {
      padding-left: 28px !important;
      margin-bottom: 0 !important;
      height: 38px;
      width: 180px;
    }
    .search-input-group button {
      height: 38px;
      padding: 0 16px;
      margin-left: 8px;
    }
    .section-header {
      margin-bottom: 16px;
    }
    .section-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }
    .sub-label {
      color: #888;
      font-size: 0.85rem;
    }
    .empty-card {
      text-align: center;
      padding: 48px 24px;
    }
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 12px;
    }
    .empty-card h4 {
      margin: 0 0 8px 0;
      font-size: 1.1rem;
    }
    .empty-card p {
      color: #777;
      max-width: 460px;
      margin: 0 auto;
      font-size: 0.9rem;
    }
    .appointment-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      margin-bottom: 16px;
    }
    .apt-badge {
      background: #e8f5e9;
      color: #2e7d32;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .barber-name {
      color: #666;
      font-size: 0.9rem;
      margin-top: 4px;
    }
    .price {
      font-weight: 700;
      font-size: 1.1rem;
      color: #000;
      margin-top: 4px;
    }
  `]
})
export class ClientDashboardComponent implements OnInit {
  clientData: any = { name: '', email: '', phone: '' };
  barberUsername = '';
  appointments: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.api.getClientProfile().subscribe({
      next: (data) => {
        this.clientData = data;
      },
      error: () => {
        // Fallback com dados do localStorage se disponível
        this.clientData = {
          name: localStorage.getItem('name') || '',
          email: localStorage.getItem('email') || '',
          phone: ''
        };
      }
    });
  }

  goToBarber() {
    if (!this.barberUsername) return;
    const clean = this.barberUsername.replace('@', '').trim();
    if (clean) {
      this.router.navigate([`/@${clean}`]);
    }
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/client/login']);
  }
}
