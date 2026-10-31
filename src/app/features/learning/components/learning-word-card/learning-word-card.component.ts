import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
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
import { Subscription } from 'rxjs';
import type { WordCard } from '../../../../core/models/vocabulary.model';

@Component({
  selector: 'app-learning-word-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-word-card.component.html',
  styleUrl: './learning-word-card.component.css',
})
export class LearningWordCardComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) word!: WordCard;
  @Input({ required: true }) language: 'de' | 'en' = 'de';
  @Input({ required: true }) position = 1;
  @Input({ required: true }) totalWords = 1;
  @Input({ required: true }) showAnswer = false;

  @Output() answerToggled = new EventEmitter<void>();
  @Output() learned = new EventEmitter<WordCard>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  @ViewChild('wordSlide') private wordSlide?: ElementRef<HTMLElement>;
  imageLoadFailed = false;
  private imageRequest?: Subscription;
  private cardAnimation?: Animation;
  private touchStartX: number | null = null;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['word'] || !this.word) return;
    if (!changes['word'].firstChange && this.wordSlide) this.animateCard();
  }

  ngOnDestroy(): void {
    this.imageRequest?.unsubscribe();
    this.cardAnimation?.cancel();
  }

  displayWord(): string {
    return this.language === 'de'
      ? this.word.word
      : this.word.translationEnglish;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) return;
    const distance =
      (event.changedTouches[0]?.clientX ?? this.touchStartX) - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) this.next.emit();
    else this.previous.emit();
  }

  onImageError(): void {
    this.imageLoadFailed = true;
  }

  private animateCard(): void {
    if (
      !isPlatformBrowser(this.platformId) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    this.cardAnimation?.cancel();
    requestAnimationFrame(() => {
      const slide = this.wordSlide?.nativeElement;
      if (!slide?.isConnected) return;
      this.cardAnimation = slide.animate([{ opacity: 0.72 }, { opacity: 1 }], {
        duration: 180,
        easing: 'ease-out',
      });
    });
  }
}
