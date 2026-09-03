import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="header">
      <div class="container header-content">
        <img src="/assets/logo.png" alt="Scizzor Logo" class="logo-img">
        <nav>
          <a routerLink="/client/login" class="nav-link client-nav-link">Sou Cliente</a>
          <a routerLink="/login" class="nav-link">Portal Salão</a>
          <button routerLink="/register">Cadastrar Salão</button>
        </nav>
      </div>
    </header>

    <main class="hero">
      <div class="container hero-content">
        <h1>O gerenciamento do seu salão, focado no essencial.</h1>
        <p>Scizzor é a plataforma minimalista projetada para barbeiros e profissionais da beleza gerenciarem seus serviços e produtos com classe e simplicidade.</p>
        <button routerLink="/register" class="cta-btn">Começar Gratuitamente</button>
      </div>
    </main>
  `,
  styles: [`
    .header {
      border-bottom: 1px solid var(--border-color);
      padding: 16px 0;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-link {
      margin-right: 24px;
    }
    .hero {
      padding: 120px 0;
      text-align: center;
    }
    .hero-content h1 {
      font-size: 3.5rem;
      margin-bottom: 24px;
      line-height: 1.1;
    }
    .hero-content p {
      font-size: 1.2rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto 40px;
    }
    .cta-btn {
      font-size: 1.2rem;
      padding: 16px 32px;
    }
  `]
})
export class LandingComponent {}
