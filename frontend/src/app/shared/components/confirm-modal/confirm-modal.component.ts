import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent {
  readonly open = input(false);
  readonly title = input.required<string>();
  readonly description = input.required<string>();

  readonly close = output<void>();
  readonly confirm = output<void>();
}
