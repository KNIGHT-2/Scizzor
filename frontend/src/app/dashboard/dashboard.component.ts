import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dash-layout">
      <aside class="sidebar">
        <div class="brand">
          <img src="/assets/logo.png" alt="Scizzor" class="logo-img">
        </div>
        <nav class="dash-nav">
          <a href="#" [class.active]="activeTab === 'scizzor'" (click)="setTab('scizzor'); $event.preventDefault()">Meu Scizzor</a>
          <a href="#" [class.active]="activeTab === 'sales'" (click)="setTab('sales'); $event.preventDefault()">Minhas Vendas</a>
          <a href="#" [class.active]="activeTab === 'profile'" (click)="setTab('profile'); $event.preventDefault()">Meu Perfil</a>
          <a href="#" [class.active]="activeTab === 'services'" (click)="setTab('services'); $event.preventDefault()">Meus Serviços</a>
          <a href="#" [class.active]="activeTab === 'products'" (click)="setTab('products'); $event.preventDefault()">Meus Produtos</a>
        </nav>
        <div class="sidebar-footer">
          <button class="outline" (click)="logout()">Sair</button>
        </div>
      </aside>
      
      <main class="content">
        <header class="content-header">
          <h1>{{ activeTab === 'scizzor' ? 'Meu Scizzor' : (activeTab === 'sales' ? 'Minhas Vendas' : (activeTab === 'services' ? 'Gerenciar Serviços' : (activeTab === 'products' ? 'Gerenciar Produtos' : 'Meu Perfil'))) }}</h1>
        </header>

        <!-- Profile Section -->
        <section class="profile-section" *ngIf="activeTab === 'profile'">
          <div class="card profile-card">
            <div class="profile-form">
              <div class="input-group">
                <label>Nome do Estabelecimento</label>
                <input type="text" [(ngModel)]="editProfileData.name" placeholder="Nome">
              </div>
              <div class="input-group">
                <label>Username</label>
                <div class="username-input-wrapper">
                  <span class="user-prefix">@</span>
                  <input type="text" [(ngModel)]="editProfileData.username" placeholder="meusalao">
                </div>
              </div>
              <div class="input-group">
                <label>E-mail</label>
                <input type="email" [(ngModel)]="editProfileData.email" placeholder="E-mail">
              </div>
              
              <div class="divider"></div>
              
              <div class="input-group">
                <label>Nova Senha (deixe em branco para não alterar)</label>
                <input type="password" [(ngModel)]="editProfileData.newPassword" placeholder="••••••••">
              </div>

              <div class="profile-actions">
                <button (click)="saveProfile()" [disabled]="isSavingProfile">
                  {{ isSavingProfile ? 'Salvando...' : 'Salvar Alterações' }}
                </button>
              </div>
            </div>
          </div>
          <div *ngIf="message && activeTab === 'profile'" [class.error-msg]="messageType === 'error'" [class.success-msg]="messageType === 'success'" class="status-msg">
            <span *ngIf="messageType === 'error'">⚠️</span>
            <span *ngIf="messageType === 'success'">✅</span>
            {{ message }}
          </div>
        </section>

        <!-- Services/Products Form Section -->
        <section class="card" *ngIf="activeTab === 'services' || activeTab === 'products'">
          <div class="form-row">
            <div class="input-group">
              <label>Nome</label>
              <input type="text" [(ngModel)]="newItem.name" placeholder="Ex: Corte de Cabelo" [disabled]="isAdding" (keyup.enter)="addItem()">
            </div>
            <div class="input-group">
              <label>Preço</label>
              <div class="price-input-wrapper">
                <span class="currency-prefix">R$</span>
                <input type="text" [(ngModel)]="newItem.price" placeholder="0,00" [disabled]="isAdding" (keyup.enter)="addItem()">
              </div>
            </div>
            <div class="input-group" *ngIf="activeTab === 'products'" style="flex: 0 0 100px;">
              <label>Quantidade</label>
              <input type="number" [(ngModel)]="newItem.quantity" placeholder="0" [disabled]="isAdding" (keyup.enter)="addItem()">
            </div>
            <button class="add-btn" (click)="addItem()" [disabled]="isAdding">
              {{ isAdding ? 'Adicionando...' : 'Adicionar' }}
            </button>
          </div>
          <div *ngIf="message" [class.error-msg]="messageType === 'error'" [class.success-msg]="messageType === 'success'" class="status-msg">
            <span *ngIf="messageType === 'error'">⚠️</span>
            <span *ngIf="messageType === 'success'">✅</span>
            {{ message }}
          </div>
        </section>

        <section class="list-section" *ngIf="activeTab === 'services' || activeTab === 'products'">
          <div class="loading-spinner" *ngIf="isLoading">Carregando itens...</div>
          
          <div class="card item-card" *ngFor="let item of items">
            <div *ngIf="!item.isEditing" class="item-info">
              <h3>{{ item.name }}</h3>
              <p>R$ {{ item.price.toFixed(2).replace('.', ',') }} <span *ngIf="activeTab === 'products'" class="item-qty"> • {{ item.quantity }} unidades</span></p>
            </div>
            
            <div *ngIf="item.isEditing" class="item-edit">
              <input type="text" [(ngModel)]="item.editName">
              <input type="text" [(ngModel)]="item.editPrice" placeholder="0,00">
              <input type="number" *ngIf="activeTab === 'products'" [(ngModel)]="item.editQuantity" placeholder="Qtd" style="flex: 0 0 80px;">
            </div>

            <div class="item-actions">
              <button *ngIf="!item.isEditing" class="outline" (click)="editItem(item)">Editar</button>
              <button *ngIf="item.isEditing" (click)="saveItem(item)">Salvar</button>
              <button *ngIf="!item.isEditing" class="outline delete-btn" (click)="deleteItem(item.id, item)">Excluir</button>
            </div>
          </div>
          
          <div *ngIf="!isLoading && items.length === 0" class="empty-state">
            Nenhum {{ activeTab === 'services' ? 'serviço' : 'produto' }} cadastrado ainda.
          </div>
        </section>

        <!-- Meu Scizzor Section -->
        <section class="list-section" *ngIf="activeTab === 'scizzor'">
          <div class="loading-spinner" *ngIf="isLoading">Carregando itens...</div>
          
          <div class="card item-card" *ngFor="let item of scizzorItems">
            <div class="item-info">
              <h3>{{ item.name }} <span class="badge">{{ item.type === 'PRODUCT' ? 'Produto' : 'Serviço' }}</span></h3>
              <p>R$ {{ item.price.toFixed(2).replace('.', ',') }} <span *ngIf="item.type === 'PRODUCT'" class="item-qty"> • {{ item.quantity }} em estoque</span></p>
            </div>
            
            <div class="sale-actions">
              <div class="qty-control">
                <button (click)="item.saleQuantity = (item.saleQuantity || 1) - 1; $event.preventDefault()" [disabled]="(item.saleQuantity || 1) <= 1">-</button>
                <input type="number" [(ngModel)]="item.saleQuantity" (ngModelChange)="item.saleQuantity = $event || 1" min="1">
                <button (click)="item.saleQuantity = (item.saleQuantity || 1) + 1; $event.preventDefault()">+</button>
              </div>
              <button class="add-btn" (click)="confirmSale(item, 'add')">Adicionar Venda</button>
            </div>
          </div>
          
          <div *ngIf="!isLoading && scizzorItems.length === 0" class="empty-state">
            Nenhum serviço ou produto disponível.
          </div>
        </section>

        <!-- Minhas Vendas Section -->
        <section class="list-section" *ngIf="activeTab === 'sales'">
          <div class="loading-spinner" *ngIf="isLoading">Carregando vendas...</div>
          
          <div *ngFor="let monthGroup of salesByMonth" class="month-group">
            <h2 class="month-title">{{ monthGroup.month }}</h2>
            <div class="card item-card" *ngFor="let sale of monthGroup.sales">
              <div class="item-info">
                <h3>{{ sale.itemName }} <span class="badge">{{ sale.itemType === 'PRODUCT' ? 'Produto' : 'Serviço' }}</span></h3>
                <p>Data: {{ formatSaleDate(sale.saleDate) }}</p>
              </div>
              <div class="sale-details">
                <p>Qtd: <strong>{{ sale.quantity }}</strong></p>
                <p>Total: <strong>R$ {{ sale.totalPrice.toFixed(2).replace('.', ',') }}</strong></p>
                <button class="outline delete-btn" style="margin-top: 8px; font-size: 0.8rem; padding: 4px 12px; height: auto;" (click)="confirmSale(sale, 'remove')">Remover</button>
              </div>
            </div>
          </div>
          
          <div *ngIf="!isLoading && salesByMonth.length === 0" class="empty-state">
            Nenhuma venda registrada ainda.
          </div>
        </section>
      </main>

      <!-- Modal de Confirmação de Venda -->
      <div class="modal-overlay" *ngIf="showSaleModal" (click)="cancelSale()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmar Ação</h3>
          </div>
          <p>
            Você está prestes a <strong>{{ saleActionType === 'add' ? 'adicionar' : 'remover' }}</strong> 
            {{ saleActionType === 'add' ? (itemForSale?.saleQuantity || 1) : itemForSale?.quantity }} venda(s) de "{{ saleActionType === 'add' ? itemForSale?.name : itemForSale?.itemName }}". Deseja continuar?
          </p>
          <div class="modal-footer">
            <button class="outline" (click)="cancelSale()">Cancelar</button>
            <button class="add-btn" [class.delete-confirm-btn]="saleActionType === 'remove'" (click)="executeSale()" [disabled]="isProcessingSale">
              {{ isProcessingSale ? 'Aguarde...' : 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmação de Senha (Perfil) -->
      <div class="modal-overlay" *ngIf="showConfirmPasswordModal" (click)="cancelProfileUpdate()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmar Alterações</h3>
          </div>
          <p>Para salvar as alterações no seu perfil, por favor confirme sua <strong>senha atual</strong>.</p>
          <div class="input-group">
            <label>Senha Atual</label>
            <input type="password" [(ngModel)]="currentPasswordConfirm" (keyup.enter)="confirmProfileUpdate()" placeholder="Digite sua senha">
          </div>
          <div class="modal-footer" style="margin-top: 24px;">
            <button class="outline" (click)="cancelProfileUpdate()">Cancelar</button>
            <button class="add-btn" (click)="confirmProfileUpdate()" [disabled]="isSavingProfile">
              {{ isSavingProfile ? 'Confirmando...' : 'Confirmar e Salvar' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Confirmação de Exclusão -->
      <div class="modal-overlay" *ngIf="showDeleteModal" (click)="cancelDelete()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmar Exclusão</h3>
          </div>
          <p>Deseja realmente apagar <strong>"{{ itemToDelete?.name }}"</strong>?</p>
          <div class="modal-footer">
            <button class="outline" (click)="cancelDelete()">Cancelar</button>
            <button class="delete-confirm-btn" (click)="confirmDelete()">Excluir Permanentemente</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dash-layout {
      display: flex;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .sidebar {
      width: 260px;
      background-color: #fff;
      border-right: 1px solid #eee;
      display: flex;
      flex-direction: column;
    }
    .brand {
      padding: 24px;
      border-bottom: 1px solid #eee;
    }
    .brand img {
      max-width: 100px;
    }
    .dash-nav {
      flex: 1;
      padding: 24px 0;
      display: flex;
      flex-direction: column;
    }
    .dash-nav a {
      padding: 12px 24px;
      border-left: 4px solid transparent;
      color: #666;
      text-decoration: none;
    }
    .dash-nav a:hover, .dash-nav a.active {
      background-color: #f5f5f5;
      color: #000;
      border-left-color: #000;
      font-weight: 600;
    }
    .sidebar-footer {
      padding: 24px;
      border-top: 1px solid #eee;
    }
    .sidebar-footer button {
      width: 100%;
    }
    .content {
      flex: 1;
      padding: 40px;
      overflow-y: auto;
    }
    .content-header {
      margin-bottom: 32px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }
    .input-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .input-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }
    .price-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .currency-prefix {
      position: absolute;
      left: 12px;
      color: #999;
      font-weight: 600;
      pointer-events: none;
    }
    .price-input-wrapper input {
      padding-left: 36px !important;
    }
    .add-btn {
      height: 42px;
      padding: 0 24px;
    }
    .form-row input {
      margin-bottom: 0;
      width: 100%;
      height: 42px;
    }
    .status-msg {
      margin-top: 12px;
      font-size: 0.9rem;
      padding: 8px 0;
    }
    .error-msg {
      color: #d32f2f;
    }
    .success-msg {
      color: #2e7d32;
    }
    .list-section {
      margin-top: 32px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .item-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: white;
    }
    .item-info p {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 4px 0 0 0;
    }
    .item-info h3 {
      font-size: 1rem;
      color: #666;
    }
    .item-qty {
      font-size: 0.9rem;
      color: #999;
      font-weight: normal;
    }
    .item-actions {
      display: flex;
      gap: 8px;
    }
    .delete-btn {
      color: #d32f2f !important;
      border-color: #d32f2f !important;
    }
    .delete-btn:hover {
      background-color: #fff1f0 !important;
    }
    .item-edit {
      display: flex;
      gap: 16px;
      flex: 1;
    }
    .item-edit input {
      margin-bottom: 0;
      padding: 8px;
      flex: 1;
    }
    .empty-state, .loading-spinner {
      text-align: center;
      padding: 40px;
      color: #999;
      background: #fff;
      border-radius: 8px;
      border: 1px dashed #ccc;
    }
    
    /* Profile Styles */
    .profile-card {
      max-width: 600px;
      padding: 32px;
    }
    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .username-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 0; /* No dashboard o input-group já tem gap */
    }
    .user-prefix {
      position: absolute;
      left: 12px;
      color: #999;
      font-weight: 600;
      pointer-events: none;
      line-height: normal;
    }
    .username-input-wrapper input {
      padding-left: 32px !important;
      width: 100%;
      margin-bottom: 0 !important;
    }
    .divider {
      height: 1px;
      background: #eee;
      margin: 10px 0;
    }
    .profile-actions {
      margin-top: 10px;
    }
    .profile-actions button {
      width: 100%;
      height: 48px;
    }
    
    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-content {
      background: white;
      padding: 32px;
      border-radius: 12px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .modal-header h3 {
      margin: 0 0 16px 0;
      font-size: 1.25rem;
    }
    .modal-content p {
      color: #666;
      margin-bottom: 32px;
    }
    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    .delete-confirm-btn {
      background-color: #000;
      color: #fff;
    }
    .delete-confirm-btn:hover {
      background-color: #d32f2f;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleUp {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .badge {
      background: #eee;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      margin-left: 8px;
      vertical-align: middle;
    }
    .sale-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .qty-control {
      display: flex;
      align-items: center;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      height: 42px;
    }
    .qty-control button {
      background: #000;
      color: #fff;
      border: none;
      width: 32px;
      height: 100%;
      cursor: pointer;
      font-weight: bold;
    }
    .qty-control button:disabled {
      background: #f5f5f5;
      color: #999;
      cursor: not-allowed;
    }
    .qty-control button:hover:not(:disabled) {
      background: #333;
    }
    .qty-control input {
      width: 50px;
      height: 100%;
      border: none;
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
      text-align: center;
      margin: 0;
      padding: 0;
      border-radius: 0;
    }
    .month-group {
      margin-bottom: 24px;
    }
    .month-title {
      font-size: 1.2rem;
      margin-bottom: 12px;
      color: #333;
      border-bottom: 2px solid #eee;
      padding-bottom: 4px;
    }
    .sale-details p {
      margin: 4px 0;
      text-align: right;
    }
  `]
})
export class DashboardComponent implements OnInit {
  activeTab: 'scizzor' | 'sales' | 'profile' | 'services' | 'products' = 'scizzor';
  items: any[] = [];
  scizzorItems: any[] = [];
  salesByMonth: { month: string, sales: any[] }[] = [];
  
  showSaleModal = false;
  saleActionType: 'add' | 'remove' = 'add';
  itemForSale: any = null;
  isProcessingSale = false;

  newItem: any = { name: '', price: '', quantity: '' };
  isLoading = false;
  isAdding = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  showDeleteModal = false;
  itemToDelete: any = null;

  // Profile Data
  profileData = { name: '', username: '', email: '' };
  editProfileData = { name: '', username: '', email: '', newPassword: '' };
  isSavingProfile = false;
  showConfirmPasswordModal = false;
  currentPasswordConfirm = '';

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadScizzorItems();
  }

  setTab(tab: 'scizzor' | 'sales' | 'profile' | 'services' | 'products') {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.message = '';
      if (tab === 'profile') {
        this.loadProfile();
      } else if (tab === 'scizzor') {
        this.loadScizzorItems();
      } else if (tab === 'sales') {
        this.loadSales();
      } else {
        this.loadItems();
      }
    }
  }

  loadProfile() {
    this.isLoading = true;
    this.api.getProfile().subscribe({
      next: (data) => {
        this.profileData = { ...data };
        this.editProfileData = { ...data, newPassword: '' };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Erro ao carregar perfil.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile() {
    this.showConfirmPasswordModal = true;
    this.currentPasswordConfirm = '';
  }

  confirmProfileUpdate() {
    if (!this.currentPasswordConfirm) {
      this.showMessage('A senha atual é obrigatória.', 'error');
      return;
    }

    this.isSavingProfile = true;

    const newUsername = this.editProfileData.username;

    if (newUsername && (newUsername.length < 4 || newUsername.length > 35)) {
      this.showMessage('O nome de usuário deve ter entre 4 e 35 caracteres.', 'error');
      this.isSavingProfile = false;
      return;
    }

    if (newUsername && newUsername.startsWith('@')) {
      this.showMessage('O nome de usuário não pode começar com "@".', 'error');
      this.isSavingProfile = false;
      return;
    }

    const updateData = {
      ...this.editProfileData,
      username: newUsername,
      currentPassword: this.currentPasswordConfirm
    };

    this.api.updateProfile(updateData).subscribe({
      next: (res) => {
        this.isSavingProfile = false;
        this.showConfirmPasswordModal = false;
        this.showMessage(res.message || 'Perfil atualizado!', 'success');
        this.loadProfile(); // Recarrega os dados
      },
      error: (err) => {
        this.isSavingProfile = false;
        const errMsg = err.error?.message || 'Erro ao atualizar perfil.';
        this.showMessage(errMsg, 'error');
      }
    });
  }

  cancelProfileUpdate() {
    this.showConfirmPasswordModal = false;
    this.currentPasswordConfirm = '';
  }

  loadItems() {
    this.items = []; // Limpa a lista antes de carregar os novos dados
    this.isLoading = true;
    const observer = {
      next: (data: any[]) => {
        this.items = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        } else {
          this.showMessage('Erro ao carregar itens.', 'error');
        }
        this.cdr.detectChanges();
      }
    };

    if (this.activeTab === 'services') {
      this.api.getServices().subscribe(observer);
    } else if (this.activeTab === 'products') {
      this.api.getProducts().subscribe(observer);
    }
  }

  addItem() {
    if (!this.newItem.name && !this.newItem.price) {
      this.showMessage('Preencha os dados do item.', 'error');
      return;
    }
    if (!this.newItem.name) {
      this.showMessage('O nome do item é obrigatório.', 'error');
      return;
    }
    if (!this.newItem.price) {
      this.showMessage('O preço é obrigatório.', 'error');
      return;
    }

    // Converte vírgula para ponto e remove espaços
    const priceStr = String(this.newItem.price).replace(',', '.').trim();
    const priceNum = parseFloat(priceStr);

    if (isNaN(priceNum)) {
      this.showMessage('Preço inválido. Use números e vírgulas ou pontos.', 'error');
      return;
    }
    if (priceNum <= 0) {
      this.showMessage('O preço deve ser maior que zero.', 'error');
      return;
    }

    // Prepara os dados para o envio de forma limpa
    const itemToCreate: any = {
      name: this.newItem.name,
      price: priceNum
    };

    if (this.activeTab === 'products') {
      itemToCreate.quantity = parseInt(String(this.newItem.quantity)) || 0;
    }

    this.isAdding = true;
    this.message = '';

    const observer = {
      next: () => {
        this.isAdding = false;
        this.newItem = { name: '', price: '', quantity: '' };
        this.showMessage('Item adicionado com sucesso!', 'success');
        this.loadItems();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isAdding = false;
        const errMsg = err.error?.message || 'Erro ao adicionar item. Verifique sua conexão.';
        this.showMessage(errMsg, 'error');
        this.cdr.detectChanges();
      }
    };

    if (this.activeTab === 'services') {
      this.api.createService(itemToCreate).subscribe(observer);
    } else {
      this.api.createProduct(itemToCreate).subscribe(observer);
    }
  }

  editItem(item: any) {
    item.isEditing = true;
    item.editName = item.name;
    // Converte o preço numérico para string com vírgula para exibição no input de edição
    item.editPrice = item.price.toString().replace('.', ',');
    if (this.activeTab === 'products') {
      item.editQuantity = item.quantity;
    }
  }

  saveItem(item: any) {
    if (!item.editName || !item.editPrice) return;

    // Converte vírgula para ponto e remove espaços
    const priceStr = String(item.editPrice).replace(',', '.').trim();
    const priceNum = parseFloat(priceStr);

    if (isNaN(priceNum) || priceNum <= 0) {
      return;
    }

    const quantityNum = this.activeTab === 'products' ? parseInt(String(item.editQuantity)) || 0 : undefined;

    const data: any = { name: item.editName, price: priceNum };
    if (quantityNum !== undefined) {
      data.quantity = quantityNum;
    }

    const observer = {
      next: () => {
        item.isEditing = false;
        this.showMessage('Item atualizado!', 'success');
        this.loadItems();
      },
      error: () => this.showMessage('Erro ao atualizar item.', 'error')
    };

    if (this.activeTab === 'services') {
      this.api.updateService(item.id, data).subscribe(observer);
    } else {
      this.api.updateProduct(item.id, data).subscribe(observer);
    }
  }

  deleteItem(id: number, item: any) {
    this.itemToDelete = { ...item, id: id || item.id };
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  confirmDelete() {
    if (!this.itemToDelete) return;

    const itemId = this.itemToDelete.id;
    const observer = {
      next: () => {
        this.showMessage('Item excluído!', 'success');
        this.showDeleteModal = false;
        this.itemToDelete = null;
        this.loadItems();
      },
      error: () => {
        this.showMessage('Erro ao excluir item.', 'error');
        this.showDeleteModal = false;
        this.itemToDelete = null;
      }
    };

    if (this.activeTab === 'services') {
      this.api.deleteService(itemId).subscribe(observer);
    } else {
      this.api.deleteProduct(itemId).subscribe(observer);
    }
  }

  loadScizzorItems() {
    this.isLoading = true;
    this.scizzorItems = [];
    forkJoin({
      services: this.api.getServices(),
      products: this.api.getProducts()
    }).subscribe({
      next: (res) => {
        const svcs = res.services.map((s: any) => ({ ...s, type: 'SERVICE', saleQuantity: 1 }));
        const prods = res.products.map((p: any) => ({ ...p, type: 'PRODUCT', saleQuantity: 1 }));
        this.scizzorItems = [...svcs, ...prods].sort((a, b) => a.name.localeCompare(b.name));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) {
          this.router.navigate(['/login']);
        } else {
          this.showMessage('Erro ao carregar itens.', 'error');
        }
        this.cdr.detectChanges();
      }
    });
  }

  loadSales() {
    this.isLoading = true;
    this.salesByMonth = [];
    this.api.getSales().subscribe({
      next: (data: any[]) => {
        this.isLoading = false;
        this.groupSalesByMonth(data);
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.showMessage('Erro ao carregar vendas.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  groupSalesByMonth(sales: any[]) {
    const groups: { [key: string]: any[] } = {};
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    sales.forEach(sale => {
      const date = new Date(sale.saleDate);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(sale);
    });

    this.salesByMonth = Object.keys(groups).map(key => ({
      month: key,
      sales: groups[key]
    }));
  }

  formatSaleDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  confirmSale(item: any, type: 'add' | 'remove') {
    this.itemForSale = item;
    this.saleActionType = type;
    this.showSaleModal = true;
  }

  cancelSale() {
    this.showSaleModal = false;
    this.itemForSale = null;
  }

  executeSale() {
    if (!this.itemForSale) return;
    this.isProcessingSale = true;

    if (this.saleActionType === 'add') {
      const payload = {
        itemId: this.itemForSale.id,
        itemType: this.itemForSale.type,
        quantity: this.itemForSale.saleQuantity || 1
      };
      
      this.api.createSale(payload).subscribe({
        next: () => {
          this.isProcessingSale = false;
          this.showSaleModal = false;
          this.showMessage('Venda adicionada!', 'success');
          this.loadScizzorItems();
        },
        error: () => {
          this.isProcessingSale = false;
          this.showSaleModal = false;
          this.showMessage('Erro ao adicionar venda.', 'error');
        }
      });
    } else {
      this.api.deleteSale(this.itemForSale.id).subscribe({
        next: () => {
          this.isProcessingSale = false;
          this.showSaleModal = false;
          this.showMessage('Venda removida!', 'success');
          this.loadSales();
        },
        error: () => {
          this.isProcessingSale = false;
          this.showSaleModal = false;
          this.showMessage('Erro ao remover venda.', 'error');
        }
      });
    }
  }

  private showMessage(text: string, type: 'success' | 'error' = 'success') {
    this.message = text;
    this.messageType = type;
    if (type === 'success') {
      setTimeout(() => {
        if (this.message === text) this.message = '';
      }, 3000);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
