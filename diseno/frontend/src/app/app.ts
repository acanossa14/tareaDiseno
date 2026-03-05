import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService, Stats } from './services/api.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
  message: string | null = null;
  objectKeys = Object.keys;

  // Form
  form: FormGroup;

  // url shortener state
  shortUrl: string | null = null;
  shortCode: string | null = null;
  stats: Stats | null = null;
  error: string | null = null;
  isCreating = false;
  isLoadingStats = false;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.formBuilder.group({
      originalUrl: ['', [Validators.required]]
    });
  }

  get originalUrl() {
    return this.form.get('originalUrl')?.value || '';
  }

  fetchMessage(): void {
    this.api.getHello().subscribe({
      next: msg => this.message = msg,
      error: err => this.message = 'Error: ' + err
    });
  }

  create(): void {
    this.error = null;
    
    if (!this.form.valid || !this.originalUrl.trim()) {
      this.error = 'Por favor ingresa una URL válida';
      this.cdr.markForCheck();
      return;
    }

    this.isCreating = true;
    this.cdr.markForCheck();
    
    this.api.createUrl(this.originalUrl).subscribe({
      next: res => {
        this.shortUrl = res.short;
        this.shortCode = res.code;
        this.stats = null;
        this.form.reset();
        this.isCreating = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.error = err.message || 'Error al crear URL corta';
        this.isCreating = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadStats(): void {
    if (!this.shortCode) {
      console.warn('[STATS] shortCode es null/undefined');
      return;
    }
    
    console.log(`[STATS] Cargando estadísticas para código: ${this.shortCode}`);
    this.isLoadingStats = true;
    this.cdr.markForCheck();
    
    this.api.getStats(this.shortCode).subscribe({
      next: s => {
        console.log('[STATS] Respuesta recibida:', s);
        this.stats = s;
        this.isLoadingStats = false;
        this.error = null;
        console.log('[STATS] Llamando markForCheck para actualizar UI');
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('[STATS] Error:', err);
        this.error = err.message || 'Error al cargar estadísticas';
        this.isLoadingStats = false;
        console.log('[STATS] Error detectado, marcando para check');
        this.cdr.markForCheck();
      },
      complete: () => {
        console.log('[STATS] Observable completado');
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      }
    });
  }

  refreshStats(): void {
    if (!this.shortCode) return;
    
    console.log(`[STATS] Actualizando estadísticas para código: ${this.shortCode}`);
    this.isLoadingStats = true;
    this.cdr.markForCheck();
    
    this.api.getStats(this.shortCode).subscribe({
      next: s => {
        console.log('[STATS] Datos actualizados:', s);
        this.stats = s;
        this.isLoadingStats = false;
        this.error = null;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('[STATS] Error al actualizar:', err);
        this.error = 'Error al actualizar estadísticas';
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      },
      complete: () => {
        console.log('[STATS] Actualización completada');
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      }
    });
  }

  getMaxCountryAccess(): number {
    if (!this.stats || !this.stats.countries) return 1;
    return Math.max(...Object.values(this.stats.countries), 1);
  }
}
