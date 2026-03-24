import { Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'img[appImageFallback], img[fallbackImage]',
  standalone: true,
})
export class ImageFallbackDirective implements OnChanges {
  @Input('appImageFallback') fallbackSrc = '/images/default-promo.svg';
  @Input('fallbackImage') set fallbackAlias(value: string | null | undefined) {
    if (value?.trim()) {
      this.fallbackSrc = value;
    }
  }

  private hasFallbackApplied = false;
  private readonly imageElement: HTMLImageElement;

  constructor(elementRef: ElementRef<HTMLImageElement>) {
    this.imageElement = elementRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fallbackSrc'] || changes['fallbackAlias']) {
      this.hasFallbackApplied = false;
    }
  }

  @HostListener('error')
  onImageError(): void {
    if (this.hasFallbackApplied) {
      return;
    }

    this.hasFallbackApplied = true;
    this.imageElement.src = this.fallbackSrc;
  }
}
