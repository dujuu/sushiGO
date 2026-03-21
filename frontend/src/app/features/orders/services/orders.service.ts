import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CreateOrderRequest, OrderStatus } from '../../../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private readonly api: ApiService) {}

  create(payload: CreateOrderRequest): Observable<ApiResponse<{ id: number; order_number: string }>> {
    return this.api.post<CreateOrderRequest, ApiResponse<{ id: number; order_number: string }>>('orders', payload);
  }

  status(id: string): Observable<ApiResponse<OrderStatus>> {
    return this.api.get<ApiResponse<OrderStatus>>(`orders/${id}/status`);
  }
}
