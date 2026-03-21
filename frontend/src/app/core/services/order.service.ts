import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse, LaravelPaginatedData, PaginatedData, QueryParams } from '../models/api-response.model';
import { DashboardStats, Order, OrderStatus, OrderStatusPayload } from '../models/order.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private readonly apiService: ApiService) {}

  getOrders(params?: QueryParams): Observable<PaginatedData<Order>> {
    return this.apiService
      .get<ApiResponse<LaravelPaginatedData<Order>>>('orders', params)
      .pipe(map((response) => this.normalizePaginated(response.data)));
  }

  getOrderById(id: number): Observable<Order> {
    return this.apiService
      .get<ApiResponse<Order>>(`orders/${id}`)
      .pipe(map((response) => response.data));
  }

  updateOrderStatus(id: number, payload: OrderStatusPayload): Observable<Order> {
    return this.apiService
      .patch<OrderStatusPayload, ApiResponse<Order>>(`orders/${id}/status`, payload)
      .pipe(map((response) => response.data));
  }

  cancelOrder(id: number): Observable<Order> {
    return this.apiService
      .patch<Record<string, never>, ApiResponse<Order>>(`orders/${id}/cancel`, {})
      .pipe(map((response) => response.data));
  }

  getDashboardStats(totalProducts: number, activePromotions: number): Observable<DashboardStats> {
    return this.getOrders({ per_page: 200 }).pipe(
      map((ordersResult) => {
        const orders = ordersResult.data;
        const byStatus = (status: OrderStatus) => orders.filter((order) => order.status === status).length;

        return {
          totalProducts,
          activePromotions,
          totalOrders: ordersResult.total,
          pendingOrders: byStatus('pending'),
          preparingOrders: byStatus('preparing'),
          completedOrders: byStatus('completed'),
        };
      }),
    );
  }

  private normalizePaginated(payload: LaravelPaginatedData<Order>): PaginatedData<Order> {
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
