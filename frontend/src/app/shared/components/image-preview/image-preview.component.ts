import { Component, input } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  standalone: true,
  template: `
    <div class="preview">
      @if (imageUrl()) {
        <img [src]="imageUrl()" [alt]="alt()" />
      } @else {
        <p>Sin imagen de referencia</p>
      }
    </div>
  `,
  styles: [
    `
      .preview {
        align-items: center;
        background: var(--surface-2);
        border: 1px dashed var(--border-2);
        border-radius: 10px;
        display: flex;
        justify-content: center;
        min-height: 120px;
        overflow: hidden;
      }

      img {
        height: 120px;
        object-fit: cover;
        width: 100%;
      }

      p {
        color: var(--muted);
        font-size: 0.76rem;
      }
    `,
  ],
})
export class ImagePreviewComponent {
  readonly imageUrl = input<string | null>('');
  readonly alt = input('Preview');
}
