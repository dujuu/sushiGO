import { Component, input } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css'],
})
export class ImagePreviewComponent {
  readonly imageUrl = input<string | null>('');
  readonly alt = input('Preview');
}
