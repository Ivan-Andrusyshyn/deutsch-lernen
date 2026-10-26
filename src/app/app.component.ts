import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Phrase, ReadingText, phrases, readingTexts, vocabulary, WordCard } from './vocabulary';

interface SavedProgress {
  learned: string[];
  favorites: string[];
  dailyProgress: Record<string, string[]>;
}

type LearningTab = 'words' | 'phrases' | 'texts';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild('wordSlide') private wordSlide?: ElementRef<HTMLElement>;

  readonly words = vocabulary;
  readonly phrases = phrases;
  readonly readingTexts = readingTexts;
  readonly dailyGoal = 5;
  readonly categories = ['Усі слова', ...new Set(vocabulary.map((word) => word.category))];
  readonly encouragements = [
    'Чудова робота! Кожен крок наближає тебе до вільної німецької.',
    'Супер! Це слово вже у твоєму активному словнику.',
    'Так тримати! Регулярна практика — найкращий шлях до успіху.',
    'Wunderbar! Сьогодні ти чудово просунувся(-лася).',
    'Молодець! Ще одне слово тепер твоє.',
  ];

  activeTab: LearningTab = 'words';
  activeCategory = 'Усі слова';
  searchQuery = '';
  learned = new Set<string>();
  favorites = new Set<string>();
  dailyProgress: Record<string, string[]> = {};
  currentWord = vocabulary[0];
  showAnswer = false;
  feedback = '';
  storageMessage = '';
  openText = -1;
  wordIndex = 0;
  private isBrowser = false;
  private touchStartX: number | null = null;
  private wordCardAnimation?: Animation;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) setTimeout(() => this.restoreProgress(), 0);
  }

  private restoreProgress(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    let saved: string | null;
    try {
      saved = window.localStorage.getItem('deutsch-kompass-progress-v1');
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage = 'Браузер не дозволив доступ до збережених даних.';
        return;
      }
      throw error;
    }
    if (!saved) return;

    try {
      const progress: unknown = JSON.parse(saved);
      if (!this.isSavedProgress(progress)) {
        this.storageMessage = 'Не вдалося прочитати збережений прогрес. Спробуй почати нове заняття.';
        return;
      }
      this.learned = new Set(progress.learned.filter((id) => this.words.some((word) => word.id === id)));
      this.favorites = new Set(progress.favorites.filter((id) => this.words.some((word) => word.id === id)));
      this.dailyProgress = Object.fromEntries(
        Object.entries(progress.dailyProgress).map(([date, ids]) => [
          date,
          ids.filter((id) => this.words.some((word) => word.id === id)),
        ]),
      );
      this.currentWord = this.nextUnlearnedWord() ?? this.words[0];
      this.wordIndex = this.words.indexOf(this.currentWord);
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.storageMessage = 'Збережений прогрес пошкоджено. Дані не змінено.';
        return;
      }
      throw error;
    }
  }

  get visibleWords(): WordCard[] {
    const query = this.searchQuery.trim().toLocaleLowerCase('uk');
    return this.words.filter((word) => {
      const matchesCategory = this.activeCategory === 'Усі слова' || word.category === this.activeCategory;
      const matchesQuery =
        !query ||
        word.word.toLocaleLowerCase('de').includes(query) ||
        word.translation.toLocaleLowerCase('uk').includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  get learnedCount(): number {
    return this.learned.size;
  }

  get progressPercent(): number {
    if (this.learnedCount === 0) return 0;
    return Math.max(1, Math.round((this.learnedCount / this.words.length) * 100));
  }

  get todayCount(): number {
    return this.dailyProgress[this.todayKey]?.length ?? 0;
  }

  get streak(): number {
    const days = new Set(Object.keys(this.dailyProgress).filter((date) => this.dailyProgress[date].length > 0));
    const cursor = new Date();
    if (!days.has(this.todayKey)) cursor.setDate(cursor.getDate() - 1);

    let count = 0;
    while (days.has(this.dateKey(cursor))) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  get progressMessage(): string {
    if (this.progressPercent === 100) return `Усі ${this.words.length} слів вивчено — це неймовірно!`;
    if (this.learnedCount === 0) return 'Почни з першого слова — у тебе все вийде!';
    if (this.todayCount >= this.dailyGoal) return 'Денну ціль виконано. Ти неймовірний(-а)!';
    return 'Маленькі кроки щодня — і німецька стане звичкою.';
  }

  get encouragement(): string {
    return this.encouragements[(this.learnedCount + this.todayCount) % this.encouragements.length];
  }

  get nextWord(): WordCard | undefined {
    return this.nextUnlearnedWord();
  }

  selectTab(tab: LearningTab): void {
    this.activeTab = tab;
    this.feedback = '';
  }

  startLearning(): void {
    this.activeTab = 'words';
    this.activeCategory = 'Усі слова';
    this.searchQuery = '';

    const next = this.nextUnlearnedWord();
    if (next) {
      this.currentWord = next;
      this.wordIndex = this.words.indexOf(next);
      this.showAnswer = false;
      this.feedback = '';
      this.animateWordTransition();
    } else {
      this.currentWord = this.words[0];
      this.wordIndex = 0;
      this.showAnswer = false;
      this.feedback = 'Ти вивчив(-ла) весь словник! Повтори обрані слова або почитай тексти.';
    }

    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('learning')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showPreviousWord(): void {
    this.setCurrentWord((this.wordIndex - 1 + this.words.length) % this.words.length);
  }

  showNextWord(): void {
    this.setCurrentWord((this.wordIndex + 1) % this.words.length);
  }

  onWordTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  onWordTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX;
    if (endX === undefined) return;
    const distance = endX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(distance) < 45) return;
    if (distance < 0) this.showNextWord();
    else this.showPreviousWord();
  }

  private setCurrentWord(index: number): void {
    this.wordIndex = index;
    this.currentWord = this.words[index];
    this.showAnswer = false;
    this.feedback = '';
    this.animateWordTransition();
  }

  private animateWordTransition(): void {
    if (!isPlatformBrowser(this.platformId) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.wordCardAnimation?.cancel();

    requestAnimationFrame(() => {
      const slide = this.wordSlide?.nativeElement;
      if (!slide?.isConnected) return;
      this.wordCardAnimation = slide.animate(
        [
          { opacity: 0.72 },
          { opacity: 1 },
        ],
        { duration: 180, easing: 'ease-out' },
      );
    });
  }

  markLearned(word: WordCard): void {
    if (this.learned.has(word.id)) {
      this.feedback = 'Це слово вже позначено як вивчене. Чудова робота!';
      return;
    }

    this.learned.add(word.id);
    const today = this.todayKey;
    this.dailyProgress[today] = [...new Set([...(this.dailyProgress[today] ?? []), word.id])];
    const next = this.nextUnlearnedWord();
    this.currentWord = next ?? word;
    this.wordIndex = this.words.indexOf(this.currentWord);
    this.showAnswer = false;
    this.feedback = this.encouragement;
    if (next) this.animateWordTransition();
    this.saveProgress();
  }

  toggleFavorite(word: WordCard): void {
    if (this.favorites.has(word.id)) {
      this.favorites.delete(word.id);
    } else {
      this.favorites.add(word.id);
    }
    this.saveProgress();
  }

  isFavorite(word: WordCard): boolean {
    return this.favorites.has(word.id);
  }

  isLearned(word: WordCard): boolean {
    return this.learned.has(word.id);
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
  }

  toggleText(index: number): void {
    this.openText = this.openText === index ? -1 : index;
  }

  showPhraseFeedback(phrase: Phrase): void {
    this.feedback = `Чудово! Повтори вголос: «${phrase.german}»`;
  }

  showTextFeedback(text: ReadingText): void {
    this.feedback = `Ти прочитав(-ла) текст «${text.title}» — чудовий крок!`;
  }

  private get todayKey(): string {
    return this.dateKey(new Date());
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private nextUnlearnedWord(): WordCard | undefined {
    return this.words.find((word) => !this.learned.has(word.id));
  }

  private saveProgress(): void {
    if (!this.isBrowser) return;
    const progress: SavedProgress = {
      learned: [...this.learned],
      favorites: [...this.favorites],
      dailyProgress: this.dailyProgress,
    };

    try {
      window.localStorage.setItem('deutsch-kompass-progress-v1', JSON.stringify(progress));
      this.storageMessage = '';
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage = 'Не вдалося зберегти прогрес. Перевір налаштування сховища браузера.';
        return;
      }
      throw error;
    }
  }

  private isSavedProgress(value: unknown): value is SavedProgress {
    if (!value || typeof value !== 'object') return false;
    const progress = value as Partial<SavedProgress>;
    return (
      Array.isArray(progress.learned) &&
      progress.learned.every((id) => typeof id === 'string') &&
      Array.isArray(progress.favorites) &&
      progress.favorites.every((id) => typeof id === 'string') &&
      typeof progress.dailyProgress === 'object' &&
      progress.dailyProgress !== null &&
      Object.values(progress.dailyProgress).every(
        (ids) => Array.isArray(ids) && ids.every((id) => typeof id === 'string'),
      )
    );
  }
}
