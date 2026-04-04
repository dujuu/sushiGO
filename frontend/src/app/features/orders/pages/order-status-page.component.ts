import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order-status-page',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './order-status-page.component.html',
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
