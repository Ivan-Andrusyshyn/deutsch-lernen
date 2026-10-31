import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import type { WordCard } from '../../../core/models/vocabulary.model';
import { PixabayImageService, type VocabularyImage } from '../../../core/services/pixabay-image.service';

@Component({
  selector: 'app-vocabulary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vocabulary-card.component.html',
  styleUrl: './vocabulary-card.component.css',
})
export class VocabularyCardComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('photoContainer') private photoContainer?: ElementRef<HTMLElement>;
  @Input({ required: true }) word!: WordCard;
  @Input({ required: true }) language!: 'de' | 'en';
  @Input({ required: true }) displayWord!: string;
  @Input() favorite = false;
  @Input() learned = false;

  @Output() favoriteToggled = new EventEmitter<WordCard>();
  @Output() learnedToggled = new EventEmitter<WordCard>();

  image: VocabularyImage | null = null;
  imageFailed = false;
  private observer?: IntersectionObserver;
  private imageRequest?: Subscription;
  private hasRequestedImage = false;
  private readonly isBrowser: boolean;

  constructor(
    private readonly pixabayImageService: PixabayImageService,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    this.observeImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['word'] && !changes['word'].firstChange) {
      this.imageRequest?.unsubscribe();
      this.image = null;
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
    this.image = null;
    this.imageFailed = true;
  }

  private observeImage(): void {
    if (!this.isBrowser || !this.photoContainer || this.hasRequestedImage) {
      return;
    }

    this.observer?.disconnect();
    if (!('IntersectionObserver' in window)) {
      this.loadImage();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.observer?.disconnect();
          this.loadImage();
        }
      },
      { rootMargin: '240px' },
    );
    this.observer.observe(this.photoContainer.nativeElement);
  }

  private loadImage(): void {
    if (this.hasRequestedImage) {
      return;
    }
    this.hasRequestedImage = true;
    this.imageRequest = this.pixabayImageService.findImage(this.word.translationEnglish).subscribe({
      next: (image) => {
        this.image = image;
        this.imageFailed = image === null;
      },
      error: () => {
        this.imageFailed = true;
      },
    });
  }

  get imageIllustration(): string {
    const term = this.word.translationEnglish.toLocaleLowerCase('en');
    const matchingVisuals: Array<[RegExp, string]> = [
      [/\b(dog|puppy)\b/, '🐕'],
      [/\b(cat|kitten)\b/, '🐈'],
      [/\b(bird|eagle|owl|duck|chicken)\b/, '🐦'],
      [/\b(horse|pony)\b/, '🐎'],
      [/\b(cow|bull|cattle)\b/, '🐄'],
      [/\b(sheep|lamb)\b/, '🐑'],
      [/\b(pig|pork)\b/, '🐖'],
      [/\b(rabbit|hare)\b/, '🐇'],
      [/\b(computer mouse)\b/, '🖱️'],
      [/\b(mouse|mice|rat)\b/, '🐁'],
      [/\b(fish|trout|salmon)\b/, '🐟'],
      [/\b(apple|pear|peach|cherry|strawberry|banana|orange|lemon|grape)\b/, '🍎'],
      [/\b(bread|bun|roll)\b/, '🥖'],
      [/\b(cheese|milk|yogurt|egg|butter)\b/, '🧀'],
      [/\b(meat|beef|steak|sausage|ham)\b/, '🥩'],
      [/\b(rice|pasta|noodle|soup|salad)\b/, '🍲'],
      [/\b(potato|tomato|cucumber|onion|carrot|pepper|pumpkin|mushroom)\b/, '🥕'],
      [/\b(cake|pie|chocolate|cookie|sugar)\b/, '🍰'],
      [/\b(coffee|espresso)\b/, '☕'],
      [/\b(tea)\b/, '🍵'],
      [/\b(house|home|apartment|building)\b/, '🏠'],
      [/\b(table|desk)\b/, '🪑'],
      [/\b(sofa|couch|armchair|chair|stool)\b/, '🪑'],
      [/\b(bed|pillow|blanket|mattress)\b/, '🛏️'],
      [/\b(door|window|wall|floor|roof|stairs)\b/, '🚪'],
      [/\b(lamp|light|bulb)\b/, '💡'],
      [/\b(key|keys)\b/, '🔑'],
      [/\b(bag|backpack|suitcase)\b/, '🧳'],
      [/\b(refrigerator|fridge|oven|stove|washing machine)\b/, '🧺'],
      [/\b(plate|cup|glass|bottle|knife|fork|spoon)\b/, '🍽️'],
      [/\b(car|vehicle)\b/, '🚗'],
      [/\b(bus)\b/, '🚌'],
      [/\b(train|railway)\b/, '🚆'],
      [/\b(bicycle|bike)\b/, '🚲'],
      [/\b(airplane|plane|airport)\b/, '✈️'],
      [/\b(book|notebook|paper|letter)\b/, '📚'],
      [/\b(phone|telephone|smartphone)\b/, '📱'],
      [/\b(computer|laptop|keyboard|screen)\b/, '💻'],
      [/\b(family|parent|mother|father|sister|brother|child|baby|friend)\b/, '👨‍👩‍👧'],
      [/\b(person|people|woman|man|girl|boy|teacher|student|doctor)\b/, '🧑'],
      [/\b(head|face|eye|ear|nose|mouth|hand|arm|leg|foot|tooth)\b/, '🧍'],
      [/\b(school|class|lesson|exam|university|study)\b/, '🎓'],
      [/\b(work|job|office|colleague|meeting)\b/, '💼'],
      [/\b(clock|watch|time|calendar|day|week|month|year)\b/, '🕒'],
      [/\b(sun|sunshine)\b/, '☀️'],
      [/\b(moon)\b/, '🌙'],
      [/\b(rain|rainy)\b/, '🌧️'],
      [/\b(snow|snowy)\b/, '❄️'],
      [/\b(tree|forest|wood|park|garden)\b/, '🌳'],
      [/\b(flower|blossom|rose)\b/, '🌷'],
      [/\b(city|town|village|street|road|square)\b/, '🏙️'],
      [/\b(hotel|restaurant|cafe|museum|cinema|theater)\b/, '🏛️'],
      [/\b(hospital|pharmacy|medicine|tablet|bandage)\b/, '🩺'],
      [/\b(music|song|instrument)\b/, '🎵'],
      [/\b(sport|game|football|soccer|tennis)\b/, '⚽'],
      [/\b(swim|pool|water|river|lake|sea)\b/, '🌊'],
      [/\b(mountain|hill|valley)\b/, '⛰️'],
    ];
    const match = matchingVisuals.find(([pattern]) => pattern.test(term));

    if (match) {
      return match[1];
    }

    const categoryVisuals: Record<string, string> = {
      'Їжа': '🍽️',
      'Побут': '🏡',
      'Здоров’я': '🩺',
      'Технології': '💡',
      'Транспорт': '🚲',
      'Природа': '🌿',
      'Тварини': '🐾',
      'Робота': '💼',
      'Навчання': '📖',
    };

    return categoryVisuals[this.word.category] ?? (this.word.kind === 'verb' ? '🏃' : this.word.kind === 'adjective' ? '🎨' : '🧩');
  }
}
