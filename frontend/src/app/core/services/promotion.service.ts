import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, LaravelPaginatedData, PaginatedData, QueryParams } from '../models/api-response.model';
import { Promotion, PromotionPayload, PromotionProduct } from '../models/promotion.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PromotionService {
  constructor(private readonly apiService: ApiService) {}

  getPromotions(params?: QueryParams): Observable<PaginatedData<Promotion>> {
    return this.apiService
      .get<ApiResponse<LaravelPaginatedData<Promotion>>>('promotions', params)
      .pipe(map((response) => this.normalizePaginated(response.data)));
  }

  getPromotionById(id: number): Observable<Promotion> {
    return this.apiService
      .get<ApiResponse<Promotion>>(`promotions/${id}`)
      .pipe(map((response) => response.data));
  }

  createPromotion(payload: PromotionPayload): Observable<Promotion> {
    return this.apiService
      .post<PromotionPayload, ApiResponse<Promotion>>('promotions', payload)
      .pipe(map((response) => response.data));
  }

  updatePromotion(id: number, payload: Partial<PromotionPayload>): Observable<Promotion> {
    return this.apiService
      .put<Partial<PromotionPayload>, ApiResponse<Promotion>>(`promotions/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  deletePromotion(id: number): Observable<void> {
    return this.apiService.delete<ApiResponse<null>>(`promotions/${id}`).pipe(map(() => void 0));
  }

  toggleStatus(id: number, value: boolean): Observable<Promotion> {
    return this.apiService
      .patch<{ is_active: boolean }, ApiResponse<Promotion>>(`promotions/${id}/activation`, {
        is_active: value,
      })
      .pipe(map((response) => response.data));
  }

  syncProducts(id: number, products: PromotionProduct[]): Observable<Promotion> {
    return this.apiService
      .put<{ products: PromotionProduct[] }, ApiResponse<Promotion>>(`promotions/${id}/products`, {
        products,
      })
      .pipe(map((response) => response.data));
  }

  private normalizePaginated(payload: LaravelPaginatedData<Promotion>): PaginatedData<Promotion> {
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
