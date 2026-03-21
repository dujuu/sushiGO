import { Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../../../shared/models/catalog.model';
import { ProductService } from '../../../core/services/product.service';
import { PromotionService } from '../../../core/services/promotion.service';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly productsSignal = signal<Product[]>([]);
  private readonly promotionsSignal = signal<Product[]>([]);

  constructor(
    private readonly productService: ProductService,
    private readonly promotionService: PromotionService,
  ) {
    this.refresh();
  }

  refresh(): void {
    this.productService.getProducts({ is_available: true, per_page: 200 }).subscribe((response) => {
      this.productsSignal.set(response.data.map((product) => this.mapProduct(product)));
    });

    this.promotionService.getPromotions({ is_active: true, per_page: 200 }).subscribe((response) => {
      this.promotionsSignal.set(
        response.data.map((promotion) => ({
          id: promotion.id,
          name: promotion.name,
          description: promotion.description ?? 'Promoción especial.',
          ingredients: promotion.products.map((item) => item.name),
          originalPrice: promotion.original_price ? Number(promotion.original_price) : undefined,
          price: Number(promotion.promo_price),
          imageUrl: promotion.image || 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
          category: 'combo',
          isPromo: true,
          badge: 'promo',
        })),
      );
    });
  }

  getProducts(): Observable<Product[]> {
    return this.productService.getProducts({ is_available: true, per_page: 200 }).pipe(
      map((response) => response.data.map((product) => this.mapProduct(product))),
    );
  }

  getPromotions(): Observable<Product[]> {
    return this.promotionService.getPromotions({ is_active: true, per_page: 200 }).pipe(
      map((response) =>
        response.data.map((promotion) => ({
          id: promotion.id,
          name: promotion.name,
          description: promotion.description ?? 'Promoción especial.',
          ingredients: promotion.products.map((item) => item.name),
          originalPrice: promotion.original_price ? Number(promotion.original_price) : undefined,
          price: Number(promotion.promo_price),
          imageUrl: promotion.image || 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
          category: 'combo',
          isPromo: true,
          badge: 'promo' as const,
        })),
      ),
    );
  }

  snapshot(): Product[] {
    return this.productsSignal();
  }

  promotionsSnapshot(): Product[] {
    return this.promotionsSignal();
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.getProducts().pipe(map((products) => products.find((product) => String(product.id) === id)));
  }

  private mapProduct(product: {
    id: number;
    name: string;
    description: string | null;
    price: string;
    image: string | null;
  }): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description ?? 'Sin descripción disponible.',
      ingredients: [],
      price: Number(product.price),
      imageUrl: product.image || 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
      category: 'rolls',
      badge: 'popular',
    };
  }
}
