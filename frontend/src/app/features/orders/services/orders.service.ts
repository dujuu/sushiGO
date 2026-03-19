import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateOrderRequest, OrderStatus } from '../../../shared/models/order.model';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private readonly api: ApiService) {}

  create(payload: CreateOrderRequest): Observable<{ id: string }> {
    return this.api.post<CreateOrderRequest, { id: string }>('orders', payload);
  }

  status(id: string): Observable<OrderStatus> {
    return this.api.get<OrderStatus>(`orders/${id}/status`);
  }
}
