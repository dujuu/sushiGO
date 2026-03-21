import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, LaravelPaginatedData, PaginatedData, QueryParams } from '../models/api-response.model';
import { Product, ProductPayload } from '../models/product.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly apiService: ApiService) {}

  getProducts(params?: QueryParams): Observable<PaginatedData<Product>> {
    return this.apiService
      .get<ApiResponse<LaravelPaginatedData<Product>>>('products', params)
      .pipe(map((response) => this.normalizePaginated(response.data)));
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService
      .get<ApiResponse<Product>>(`products/${id}`)
      .pipe(map((response) => response.data));
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.apiService
      .post<ProductPayload, ApiResponse<Product>>('products', payload)
      .pipe(map((response) => response.data));
  }

  updateProduct(id: number, payload: Partial<ProductPayload>): Observable<Product> {
    return this.apiService
      .put<Partial<ProductPayload>, ApiResponse<Product>>(`products/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<null>>(`products/${id}`).pipe(map(() => void 0));
  }

  toggleAvailability(id: number, value: boolean): Observable<Product> {
    return this.apiService
      .patch<{ is_available: boolean }, ApiResponse<Product>>(`products/${id}/availability`, {
        is_available: value,
      })
      .pipe(map((response) => response.data));
  }

  private normalizePaginated(payload: LaravelPaginatedData<Product>): PaginatedData<Product> {
    const meta = payload.meta;

    return {
      data: payload.data,
      current_page: meta?.current_page ?? payload.current_page ?? 1,
      last_page: meta?.last_page ?? payload.last_page ?? 1,
      per_page: meta?.per_page ?? payload.per_page ?? payload.data.length,
      total: meta?.total ?? payload.total ?? payload.data.length,
    };
  }
}
