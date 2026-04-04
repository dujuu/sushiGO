import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-stack',
  standalone: true,
  templateUrl: './toast-stack.component.html',
  styleUrls: ['./toast-stack.component.css'],
})
export class ToastStackComponent {
  readonly notificationService = inject(NotificationService);
}
