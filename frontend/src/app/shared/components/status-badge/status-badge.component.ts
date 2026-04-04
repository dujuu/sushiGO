import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css'],
})
export class StatusBadgeComponent {
  readonly label = input.required<string>();

  readonly badgeClass = computed(() => {
    const key = this.label().toLowerCase().trim().replaceAll(' ', '-');
    return `badge ${key}`;
  });
}
