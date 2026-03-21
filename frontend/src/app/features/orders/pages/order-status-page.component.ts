import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-status-page',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <h1>Estado del pedido</h1>
    @if (status$ | async; as status) {
      <article class="card">
        <p><strong>ID:</strong> {{ status.id }}</p>
        <p><strong>Número:</strong> {{ status.order_number }}</p>
        <p><strong>Estado:</strong> {{ status.status }}</p>
        <p><strong>Actualizado:</strong> {{ status.updated_at }}</p>
      </article>
    }
  `,
})
export class OrderStatusPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersService = inject(OrdersService);

  readonly status$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => this.ordersService.status(id)),
    map((response) => response.data),
  );
}
