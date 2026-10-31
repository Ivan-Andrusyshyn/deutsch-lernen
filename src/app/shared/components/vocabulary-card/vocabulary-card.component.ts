import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import type { WordCard } from '../../../core/models/vocabulary.model';

@Component({
  selector: 'app-vocabulary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vocabulary-card.component.html',
  styleUrl: './vocabulary-card.component.css',
})
export class VocabularyCardComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('photoContainer') private photoContainer?: ElementRef<HTMLElement>;
  @Input({ required: true }) word!: WordCard;
  @Input({ required: true }) language!: 'de' | 'en';
  @Input({ required: true }) displayWord!: string;
  @Input() favorite = false;
  @Input() learned = false;

  @Output() favoriteToggled = new EventEmitter<WordCard>();
  @Output() learnedToggled = new EventEmitter<WordCard>();

  imageFailed = false;
  private observer?: IntersectionObserver;
  private imageRequest?: Subscription;
  private hasRequestedImage = false;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    this.observeImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['word'] && !changes['word'].firstChange) {
      this.imageRequest?.unsubscribe();
      this.imageFailed = false;
      this.hasRequestedImage = false;
      this.observeImage();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.imageRequest?.unsubscribe();
  }

  onPhotoError(): void {
    this.imageFailed = true;
  }

  private observeImage(): void {
    if (!this.isBrowser || !this.photoContainer || this.hasRequestedImage) {
      return;
    }

    this.observer?.disconnect();
    if (!('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.observer?.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    this.observer.observe(this.photoContainer.nativeElement);
  }
}
