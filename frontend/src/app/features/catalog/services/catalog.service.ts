import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../../../shared/models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly mockProducts: Product[] = [
    {
      id: '1',
      name: 'Spicy Tuna Roll',
      description: 'Atún, mayo picante y pepino · 8 piezas.',
      ingredients: ['Atún', 'Mayo spicy', 'Pepino'],
      price: 6990,
      imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=900&q=80&fit=crop',
      badge: 'popular',
      category: 'spicy',
      isPromo: true,
    },
    {
      id: '2',
      name: 'Ebi Tempura Roll',
      description: 'Camarón apanado, palta y tobiko · 8 piezas.',
      ingredients: ['Camarón', 'Palta', 'Tobiko'],
      price: 7490,
      imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
      badge: 'new',
      category: 'rolls',
    },
    {
      id: '3',
      name: 'Green Palta Roll',
      description: 'Palta, queso crema y palmito · 8 piezas.',
      ingredients: ['Palta', 'Queso crema', 'Palmito'],
      price: 5990,
      imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=900&q=80&fit=crop',
      category: 'veggie',
    },
    {
      id: '4',
      name: 'Dragon Roll',
      description: 'Salmón, palta y salsa anguila · 8 piezas.',
      ingredients: ['Salmón', 'Palta', 'Salsa anguila'],
      price: 8490,
      imageUrl: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=900&q=80&fit=crop',
      badge: 'popular',
      category: 'rolls',
    },
    {
      id: '5',
      name: 'Salmon Nigiri ×4',
      description: 'Salmón fresco sobre arroz de sushi.',
      ingredients: ['Salmón', 'Arroz'],
      price: 5490,
      imageUrl: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=900&q=80&fit=crop',
      category: 'nigiri',
    },
    {
      id: '6',
      name: 'Combo Familiar 2+1',
      description: 'Dos rolls + uno gratis para compartir.',
      ingredients: ['Mix del chef'],
      price: 19990,
      imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900&q=80&fit=crop',
      category: 'combo',
      badge: 'promo',
      isPromo: true,
    },
  ];

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  snapshot(): Product[] {
    return this.mockProducts;
  }

  getProductById(id: string): Observable<Product | undefined> {
    return of(this.mockProducts.find((product) => product.id === id));
  }
}
