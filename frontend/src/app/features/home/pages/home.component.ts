import { NgFor, NgIf } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { ImageFallbackDirective } from '../../../shared/directives/image-fallback.directive';
import { Promotion } from '../models/promotion.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, ImageFallbackDirective],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly promotions = signal<Promotion[]>([
    {
      id: 1,
      titulo: 'Omakase Lunch 20% OFF',
      descripcion: 'Disponible de lunes a viernes hasta las 16:00.',
      imagen: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
      activa: true,
    },
    {
      id: 2,
      titulo: 'Premium Nigiri Set',
      descripcion: '12 piezas seleccionadas por el chef con bebida incluida.',
      imagen: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=900&q=80&fit=crop',
      activa: true,
    },
    {
      id: 3,
      titulo: 'Chef Roll Weekend',
      descripcion: 'Promoción especial en rolls premium.',
      imagen: 'https://example.com/imagen-invalida.jpg',
      activa: false,
    },
  ]);

  readonly activePromotions = computed(() => this.promotions().filter((promotion) => promotion.activa));

  readonly hasActivePromotions = computed(() => this.activePromotions().length > 0);

  trackByPromotionId(_: number, promotion: Promotion): number {
    return promotion.id;
  }
}
