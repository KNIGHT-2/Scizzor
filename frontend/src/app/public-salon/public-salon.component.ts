import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-salon',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="public-page">
      <!-- Top Navigation -->
      <header class="public-nav">
        <div class="container nav-content">
          <a routerLink="/" class="logo-link">
            <img src="/assets/logo.png" alt="Scizzor" class="logo-img">
          </a>

          <div class="auth-actions">
            <!-- Usuário Deslogado -->
            <div *ngIf="!isLoggedIn" class="guest-actions">
              <a [routerLink]="['/client/login']" [queryParams]="{ returnUrl: currentUrl }" class="login-link">Fazer Login</a>
              <button [routerLink]="['/client/register']" [queryParams]="{ returnUrl: currentUrl }" class="btn-sm">Criar Conta</button>
            </div>

            <!-- Cliente Logado -->
            <div *ngIf="isLoggedIn && isClient" class="user-actions">
              <span class="client-greeting">Olá, <strong>{{ userName }}</strong></span>
              <button routerLink="/client/dashboard" class="outline btn-sm">Meus Agendamentos</button>
              <button (click)="logout()" class="outline btn-sm">Sair</button>
            </div>

            <!-- Salão Logado -->
            <div *ngIf="isLoggedIn && isSalon" class="user-actions">
              <span class="badge-salon">Painel do Salão</span>
              <button routerLink="/dashboard" class="outline btn-sm">Voltar ao Painel</button>
            </div>
          </div>
        </div>
      </header>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="container text-center py-5">
        <div class="spinner">Carregando informações da barbearia...</div>
      </div>

      <!-- Error / Not Found State -->
      <div *ngIf="!isLoading && notFound" class="container not-found-wrapper">
        <div class="card not-found-card">
          <div class="not-found-icon">💈</div>
          <h2>Barbearia não encontrada</h2>
          <p>O endereço <strong>@{{ username }}</strong> não existe ou está temporariamente indisponível.</p>
          <button routerLink="/" style="margin-top: 16px;">Voltar para o Início</button>
        </div>
      </div>

      <!-- Main Profile Content -->
      <main *ngIf="!isLoading && !notFound && salon" class="container profile-content">
        <!-- Hero / Header Card -->
        <section class="card salon-hero">
          <div class="hero-left">
            <div class="salon-avatar" [style.background-image]="salon.logoUrl ? 'url(' + salon.logoUrl + ')' : null">
              <span *ngIf="!salon.logoUrl">{{ salon.name ? salon.name.charAt(0).toUpperCase() : 'S' }}</span>
            </div>
            <div class="salon-titles">
              <h1>{{ salon.name }}</h1>
              <div class="handle-wrapper">
                <span class="handle-badge">&#64;{{ salon.username }}</span>
              </div>
              <p class="salon-bio" *ngIf="salon.bio">{{ salon.bio }}</p>
              
              <div class="salon-meta">
                <span *ngIf="salon.phone" class="meta-item">📞 {{ salon.phone }}</span>
                <span *ngIf="salon.address" class="meta-item">📍 {{ salon.address }}</span>
              </div>
            </div>
          </div>

          <div class="hero-right">
            <button class="cta-schedule" (click)="scrollToServices()">
              Agendar Horário
            </button>
          </div>
        </section>

        <!-- Catalog Navigation -->
        <div class="catalog-tabs">
          <button [class.active]="activeTab === 'services'" (click)="activeTab = 'services'">
            Serviços ({{ salon.services?.length || 0 }})
          </button>
          <button [class.active]="activeTab === 'products'" (click)="activeTab = 'products'">
            Produtos ({{ salon.products?.length || 0 }})
          </button>
        </div>

        <!-- Services Section -->
        <section id="services-section" *ngIf="activeTab === 'services'" class="catalog-section">
          <div *ngIf="salon.services?.length === 0" class="empty-catalog card">
            Nenhum serviço disponível no momento.
          </div>

          <div class="services-grid" *ngIf="salon.services?.length > 0">
            <div class="card service-card" *ngFor="let s of salon.services">
              <div class="service-details">
                <h3>{{ s.name }}</h3>
                <div class="service-tags">
                  <span class="duration-badge">⏱️ {{ s.durationMinutes || 30 }} min</span>
                </div>
                <div class="service-price">
                  R$ {{ s.price.toFixed(2).replace('.', ',') }}
                </div>
              </div>
              
              <div class="service-action">
                <button (click)="initiateBooking(s)">
                  Agendar
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Products Section -->
        <section *ngIf="activeTab === 'products'" class="catalog-section">
          <div *ngIf="salon.products?.length === 0" class="empty-catalog card">
            Nenhum produto disponível para venda no momento.
          </div>

          <div class="products-grid" *ngIf="salon.products?.length > 0">
            <div class="card product-card" *ngFor="let p of salon.products">
              <div class="product-details">
                <h3>{{ p.name }}</h3>
                <span class="stock-badge" [class.in-stock]="p.inStock" [class.out-stock]="!p.inStock">
                  {{ p.inStock ? 'Disponível no Salão' : 'Esgotado' }}
                </span>
                <div class="product-price">
                  R$ {{ p.price.toFixed(2).replace('.', ',') }}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- Booking Modal -->
      <div class="modal-overlay" *ngIf="selectedService" (click)="closeBookingModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmar Agendamento</h3>
            <button class="close-btn" (click)="closeBookingModal()">✕</button>
          </div>

          <div class="modal-body" *ngIf="!bookingSuccess">
            <div class="booking-summary card">
              <h4>{{ selectedService.name }}</h4>
              <p>Estabelecimento: <strong>{{ salon?.name }}</strong></p>
              <p>Duração estimada: <strong>{{ selectedService.durationMinutes || 30 }} minutos</strong></p>
              <p class="summary-price">Valor: <strong>R$ {{ selectedService.price.toFixed(2).replace('.', ',') }}</strong></p>
            </div>

            <div class="input-group" style="margin-top: 16px;">
              <label>Escolha a data desejada</label>
              <input type="date" [(ngModel)]="bookingDate">
            </div>

            <div class="input-group" style="margin-top: 12px;">
              <label>Escolha o melhor horário</label>
              <select [(ngModel)]="bookingTime">
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>
          </div>

          <div class="modal-body success-body" *ngIf="bookingSuccess">
            <div class="success-icon">✓</div>
            <h4>Agendamento Solicitado!</h4>
            <p>Seu agendamento de <strong>{{ selectedService.name }}</strong> foi registrado para o dia <strong>{{ bookingDate }}</strong> às <strong>{{ bookingTime }}</strong>.</p>
          </div>

          <div class="modal-footer">
            <button *ngIf="!bookingSuccess" class="outline" (click)="closeBookingModal()">Cancelar</button>
            <button *ngIf="!bookingSuccess" (click)="confirmBooking()" [disabled]="!bookingDate">
              Confirmar Agendamento
            </button>
            <button *ngIf="bookingSuccess" routerLink="/client/dashboard" (click)="closeBookingModal()">
              Ver Meus Agendamentos
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .public-page {
      min-height: 100vh;
      background-color: #f8f8f8;
      display: flex;
      flex-direction: column;
    }
    .public-nav {
      background: #fff;
      border-bottom: 1px solid #eee;
      padding: 16px 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-link img {
      max-width: 90px;
    }
    .auth-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .login-link {
      font-weight: 600;
      margin-right: 16px;
      font-size: 0.9rem;
      color: #000;
      text-decoration: none;
    }
    .btn-sm {
      padding: 8px 18px;
      font-size: 0.85rem;
      height: auto;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .client-greeting {
      font-size: 0.9rem;
      color: #444;
    }
    .badge-salon {
      background: #000;
      color: #fff;
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
    }
    .profile-content {
      padding: 40px 20px 80px 20px;
      max-width: 960px;
      margin: 0 auto;
      width: 100%;
    }
    .salon-hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 24px;
    }
    .hero-left {
      display: flex;
      align-items: center;
      gap: 24px;
      flex: 1;
    }
    .salon-avatar {
      width: 96px;
      height: 96px;
      border-radius: 50%;
      background-color: #111;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.2rem;
      font-weight: bold;
      background-size: cover;
      background-position: center;
      border: 3px solid #eee;
      flex-shrink: 0;
    }
    .salon-titles h1 {
      margin: 0 0 6px 0;
      font-size: 1.8rem;
    }
    .handle-badge {
      background: #eee;
      color: #555;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 20px;
    }
    .salon-bio {
      margin: 10px 0 8px 0;
      color: #555;
      font-size: 0.95rem;
      max-width: 500px;
    }
    .salon-meta {
      display: flex;
      gap: 16px;
      font-size: 0.85rem;
      color: #777;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .cta-schedule {
      padding: 14px 28px;
      font-size: 1rem;
    }
    .catalog-tabs {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 12px;
    }
    .catalog-tabs button {
      background: none;
      color: #666;
      border: none;
      font-size: 1rem;
      font-weight: 600;
      padding: 8px 16px;
      cursor: pointer;
      border-radius: 6px;
    }
    .catalog-tabs button.active {
      background: #000;
      color: #fff;
    }
    .services-grid, .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .service-card, .product-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .service-card:hover, .product-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    }
    .service-details h3, .product-details h3 {
      margin: 0 0 8px 0;
      font-size: 1.15rem;
    }
    .duration-badge {
      font-size: 0.8rem;
      color: #666;
      background: #f0f0f0;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .service-price, .product-price {
      font-size: 1.35rem;
      font-weight: 700;
      color: #000;
      margin: 16px 0;
    }
    .stock-badge {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .stock-badge.in-stock {
      background: #e8f5e9;
      color: #2e7d32;
    }
    .stock-badge.out-stock {
      background: #ffebee;
      color: #c62828;
    }
    .service-action button {
      width: 100%;
    }
    .empty-catalog {
      text-align: center;
      padding: 48px;
      color: #888;
    }
    .not-found-wrapper {
      padding: 80px 20px;
      display: flex;
      justify-content: center;
    }
    .not-found-card {
      text-align: center;
      padding: 48px;
      max-width: 450px;
    }
    .not-found-icon {
      font-size: 3rem;
      margin-bottom: 12px;
    }
    
    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: #fff;
      padding: 32px;
      border-radius: 12px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #999;
    }
    .booking-summary {
      background: #fafafa;
      border: 1px solid #eee;
      padding: 16px;
      margin-bottom: 16px;
    }
    .booking-summary h4 {
      margin: 0 0 8px 0;
    }
    .booking-summary p {
      margin: 4px 0;
      font-size: 0.9rem;
      color: #555;
    }
    .summary-price {
      font-size: 1.1rem !important;
      color: #000 !important;
      margin-top: 8px !important;
    }
    .input-group label {
      display: block;
      font-weight: 600;
      font-size: 0.85rem;
      margin-bottom: 6px;
    }
    .input-group input, .input-group select {
      width: 100%;
      height: 42px;
      padding: 0 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
    .success-body {
      text-align: center;
      padding: 20px 0;
    }
    .success-icon {
      font-size: 3rem;
      color: #2e7d32;
      margin-bottom: 12px;
    }
  `]
})
export class PublicSalonComponent implements OnInit {
  username = '';
  currentUrl = '';
  salon: any = null;
  isLoading = true;
  notFound = false;
  activeTab: 'services' | 'products' = 'services';

  // Auth Status
  isLoggedIn = false;
  isClient = false;
  isSalon = false;
  userName: string | null = '';

  // Booking Modal
  selectedService: any = null;
  bookingDate: string = new Date().toISOString().split('T')[0];
  bookingTime = '14:00';
  bookingSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let paramUser = params.get('username') || '';
      if (paramUser.startsWith('@')) {
        paramUser = paramUser.substring(1);
      }
      this.username = paramUser;
      this.currentUrl = `/@${this.username}`;
      this.checkAuth();
      this.loadSalon();
    });
  }

  checkAuth() {
    this.isLoggedIn = this.api.isLoggedIn();
    this.isClient = this.api.isClient();
    this.isSalon = this.api.isSalon();
    this.userName = this.api.getUserName();
  }

  loadSalon() {
    this.isLoading = true;
    this.notFound = false;

    this.api.getPublicSalon(this.username).subscribe({
      next: (data) => {
        this.salon = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.notFound = true;
        this.cdr.detectChanges();
      }
    });
  }

  scrollToServices() {
    this.activeTab = 'services';
    setTimeout(() => {
      const el = document.getElementById('services-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  initiateBooking(service: any) {
    if (!this.isLoggedIn || !this.isClient) {
      // Redireciona para login do cliente mantendo a intenção
      this.router.navigate(['/client/login'], {
        queryParams: {
          returnUrl: this.currentUrl,
          serviceId: service.id
        }
      });
      return;
    }

    // Cliente logado: abre modal de agendamento
    this.selectedService = service;
    this.bookingSuccess = false;
  }

  closeBookingModal() {
    this.selectedService = null;
    this.bookingSuccess = false;
  }

  confirmBooking() {
    // Simula confirmação de agendamento com feedback visual
    this.bookingSuccess = true;
  }

  logout() {
    this.api.logout();
    this.checkAuth();
    this.cdr.detectChanges();
  }
}
