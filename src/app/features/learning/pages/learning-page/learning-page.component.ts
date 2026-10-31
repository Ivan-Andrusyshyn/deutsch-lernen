import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import type { Phrase, ReadingText, WordCard } from '../../../../core/models/vocabulary.model';
import { PixabayImageService, type VocabularyImage } from '../../../../core/services/pixabay-image.service';
import { phrases, readingTexts, vocabulary } from '../../data/vocabulary';
import { VocabularyCardComponent } from '../../../../shared/components/vocabulary-card/vocabulary-card.component';

interface SavedProgress {
  learned: string[];
  favorites: string[];
  dailyProgress: Record<string, string[]>;
}

type LearningLanguage = 'de' | 'en';
type AppTheme = 'light' | 'dark';

interface SavedSettings {
  learningLanguage: LearningLanguage;
  theme: AppTheme;
}

type LearningTab = 'words' | 'phrases' | 'texts';
type WordPageSize = 10 | 20;

interface CalendarDay {
  key: string;
  day: number;
  count: number;
  intensity: 'none' | 'low' | 'medium' | 'high';
  isToday: boolean;
  isSelected: boolean;
  isFuture: boolean;
}

@Component({
  selector: 'app-learning-page',
  standalone: true,
  imports: [CommonModule, FormsModule, VocabularyCardComponent],
  templateUrl: './learning-page.component.html',
  styleUrl: './learning-page.component.css',
})
export class LearningPageComponent implements OnDestroy, OnInit {
  @ViewChild('wordSlide') private wordSlide?: ElementRef<HTMLElement>;

  readonly words = vocabulary;
  readonly phrases = phrases;
  readonly readingTexts = readingTexts;
  readonly dailyGoal = 5;
  readonly weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];
  readonly categories = ['Усі слова', ...new Set(vocabulary.map((word) => word.category))];
  readonly encouragements = [
    'Чудова робота! Кожен крок наближає тебе до мети.',
    'Супер! Це слово вже у твоєму активному словнику.',
    'Так тримати! Регулярна практика — найкращий шлях до успіху.',
    'Чудово! Сьогодні ти помітно просунувся(-лася).',
    'Молодець! Ще одне слово тепер твоє.',
  ];

  activeTab: LearningTab = 'words';
  learningLanguage: LearningLanguage = 'de';
  theme: AppTheme = 'light';
  activeCategory = 'Усі слова';
  searchQuery = '';
  wordPageSize: WordPageSize = 10;
  wordPage = 1;
  learned = new Set<string>();
  favorites = new Set<string>();
  dailyProgress: Record<string, string[]> = {};
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  selectedDateKey = this.dateKey(new Date());
  currentWord = vocabulary[0];
  currentWordImage: VocabularyImage | null = null;
  imageLoadFailed = false;
  showAnswer = false;
  feedback = '';
  storageMessage = '';
  showDailyGoalCelebration = false;
  openText = -1;
  wordIndex = 0;
  private isBrowser = false;
  private touchStartX: number | null = null;
  private wordCardAnimation?: Animation;
  private imageRequest?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly pixabayImageService: PixabayImageService,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.restoreSettings();
        this.restoreProgress();
        this.loadCurrentWordImage();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.imageRequest?.unsubscribe();
  }

  private restoreSettings(): void {
    let saved: string | null;
    try {
      saved = window.localStorage.getItem('wortzeit-settings-v1');
      if (!saved) {
        const legacySettings = window.localStorage.getItem('deutsch-kompass-settings-v1');
        if (legacySettings) {
          const parsed: unknown = JSON.parse(legacySettings);
          if (parsed && typeof parsed === 'object') {
            const previousSettings = parsed as { translationLanguage?: unknown; theme?: unknown };
            this.learningLanguage = previousSettings.translationLanguage === 'en' ? 'en' : 'de';
            if (previousSettings.theme === 'light' || previousSettings.theme === 'dark') {
              this.theme = previousSettings.theme;
            }
            this.saveSettings();
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage = 'Браузер не дозволив доступ до збережених налаштувань.';
        return;
      }
      if (error instanceof SyntaxError) {
        this.storageMessage = 'Збережені налаштування пошкоджено. Використано стандартні параметри.';
        return;
      }
      throw error;
    }
    if (!saved) return;

    try {
      const settings: unknown = JSON.parse(saved);
      if (!this.isSavedSettings(settings)) {
        this.storageMessage = 'Не вдалося прочитати збережені налаштування. Використано стандартні параметри.';
        return;
      }
      this.learningLanguage = settings.learningLanguage;
      this.theme = settings.theme;
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.storageMessage = 'Збережені налаштування пошкоджено. Використано стандартні параметри.';
        return;
      }
      throw error;
    }
  }

  private restoreProgress(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (!this.isBrowser) return;

    this.learned = new Set<string>();
    this.favorites = new Set<string>();
    this.dailyProgress = {};
    this.showDailyGoalCelebration = false;
    this.currentWord = this.words[0];
    this.wordIndex = 0;

    let saved: string | null;
    try {
      saved = window.localStorage.getItem(this.progressStorageKey);
      if (!saved && this.learningLanguage === 'de') {
        saved = window.localStorage.getItem('deutsch-kompass-progress-v1');
      }
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
      if (this.learningLanguage === 'de' && !window.localStorage.getItem(this.progressStorageKey)) {
        this.saveProgress();
      }
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
        this.displayWord(word).toLocaleLowerCase(this.learningLanguage).includes(query) ||
        word.translationEnglish.toLocaleLowerCase('en').includes(query) ||
        word.translation.toLocaleLowerCase('uk').includes(query) ||
        word.word.toLocaleLowerCase('de').includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  get paginatedWords(): WordCard[] {
    const start = (this.wordPage - 1) * this.wordPageSize;
    return this.visibleWords.slice(start, start + this.wordPageSize);
  }

  get wordPageCount(): number {
    return Math.max(1, Math.ceil(this.visibleWords.length / this.wordPageSize));
  }

  get visiblePageNumbers(): number[] {
    const windowSize = 3;
    const halfWindow = Math.floor(windowSize / 2);
    const start = Math.max(1, Math.min(this.wordPage - halfWindow, this.wordPageCount - windowSize + 1));
    const end = Math.min(this.wordPageCount, start + windowSize - 1);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  get firstVisibleWordNumber(): number {
    return this.visibleWords.length === 0 ? 0 : (this.wordPage - 1) * this.wordPageSize + 1;
  }

  get lastVisibleWordNumber(): number {
    return Math.min(this.wordPage * this.wordPageSize, this.visibleWords.length);
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

  get calendarMonthLabel(): string {
    return this.calendarMonth.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
  }

  get calendarDays(): (CalendarDay | null)[] {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const today = this.todayKey;

    return Array.from({ length: cellCount }, (_, index) => {
      const day = index - firstWeekday + 1;
      if (day < 1 || day > daysInMonth) return null;

      const key = this.dateKey(new Date(year, month, day));
      const count = new Set(this.dailyProgress[key] ?? []).size;
      const intensity: CalendarDay['intensity'] =
        count === 0 ? 'none' : count <= 2 ? 'low' : count <= 4 ? 'medium' : 'high';

      return {
        key,
        day,
        count,
        intensity,
        isToday: key === today,
        isSelected: key === this.selectedDateKey,
        isFuture: key > today,
      };
    });
  }

  get selectedDayLabel(): string {
    const [year, month, day] = this.selectedDateKey.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('uk-UA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  get selectedDayWords(): WordCard[] {
    const learnedIds = new Set(this.dailyProgress[this.selectedDateKey] ?? []);
    return this.words.filter((word) => learnedIds.has(word.id));
  }

  get selectedDayCount(): number {
    return this.selectedDayWords.length;
  }

  get selectedDayCountLabel(): string {
    return `${this.selectedDayCount} ${this.wordNoun(this.selectedDayCount)}`;
  }

  get canGoToNextCalendarMonth(): boolean {
    const currentMonth = new Date();
    return (
      this.calendarMonth.getFullYear() < currentMonth.getFullYear() ||
      (this.calendarMonth.getFullYear() === currentMonth.getFullYear() &&
        this.calendarMonth.getMonth() < currentMonth.getMonth())
    );
  }

  get calendarMonthWordCount(): number {
    const monthPrefix = `${this.calendarMonth.getFullYear()}-${String(this.calendarMonth.getMonth() + 1).padStart(2, '0')}-`;
    return Object.entries(this.dailyProgress).reduce(
      (total, [date, ids]) => total + (date.startsWith(monthPrefix) ? new Set(ids).size : 0),
      0,
    );
  }

  get calendarMonthActiveDays(): number {
    const monthPrefix = `${this.calendarMonth.getFullYear()}-${String(this.calendarMonth.getMonth() + 1).padStart(2, '0')}-`;
    return Object.entries(this.dailyProgress).filter(
      ([date, ids]) => date.startsWith(monthPrefix) && ids.length > 0,
    ).length;
  }

  get calendarMonthActiveDaysLabel(): string {
    const count = this.calendarMonthActiveDays;
    return `${count} ${this.dayNoun(count)} навчання`;
  }

  get calendarMonthWordCountLabel(): string {
    const count = this.calendarMonthWordCount;
    return `${count} ${this.wordNoun(count)}`;
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
    const language = this.learningLanguageName.toLocaleLowerCase('uk');
    if (this.progressPercent === 100) return `Усі ${this.words.length} слів ${language} вивчено — це неймовірно!`;
    if (this.learnedCount === 0) return 'Почни з першого слова — у тебе все вийде!';
    if (this.todayCount >= this.dailyGoal) return 'Денну ціль виконано. Ти неймовірний(-а)!';
    return `Маленькі кроки щодня — і ${language} стане звичкою.`;
  }

  get encouragement(): string {
    return this.encouragements[(this.learnedCount + this.todayCount) % this.encouragements.length];
  }

  get nextWord(): WordCard | undefined {
    return this.nextUnlearnedWord();
  }

  get learningLanguageName(): string {
    return this.learningLanguage === 'de' ? 'Німецька' : 'Англійська';
  }

  displayWord(word: WordCard): string {
    return this.learningLanguage === 'de' ? word.word : word.translationEnglish;
  }

  displayTranslation(word: WordCard): string {
    return word.translation;
  }

  setLearningLanguage(language: LearningLanguage): void {
    if (this.learningLanguage === language) return;
    this.learningLanguage = language;
    this.activeTab = 'words';
    this.wordPage = 1;
    this.showAnswer = false;
    this.feedback = '';
    this.storageMessage = '';
    this.saveSettings();
    this.restoreProgress();
    this.loadCurrentWordImage();
  }

  toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.saveSettings();
  }

  selectTab(tab: LearningTab): void {
    this.activeTab = tab;
    this.feedback = '';
  }

  selectWordCategory(category: string): void {
    this.activeCategory = category;
    this.wordPage = 1;
  }

  onWordSearchChange(): void {
    this.wordPage = 1;
  }

  setWordPageSize(size: WordPageSize): void {
    this.wordPageSize = size;
    this.wordPage = 1;
  }

  onWordPageSizeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.setWordPageSize(value === '20' ? 20 : 10);
  }

  setWordPage(page: number): void {
    this.wordPage = Math.max(1, Math.min(page, this.wordPageCount));
  }

  changeCalendarMonth(offset: -1 | 1): void {
    this.calendarMonth = new Date(this.calendarMonth.getFullYear(), this.calendarMonth.getMonth() + offset, 1);
    this.selectedDateKey = this.dateKey(this.calendarMonth);
  }

  selectCalendarDay(day: CalendarDay): void {
    if (day.isFuture) return;
    this.selectedDateKey = day.key;
  }

  startLearning(): void {
    this.activeTab = 'words';
    this.activeCategory = 'Усі слова';
    this.searchQuery = '';
    this.wordPage = 1;

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
      this.feedback = 'Ти вивчив(-ла) весь словник! Повтори обрані слова або обери іншу мову навчання.';
    }
    this.loadCurrentWordImage();

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
    this.loadCurrentWordImage();
    this.animateWordTransition();
  }

  onCurrentWordImageError(): void {
    this.currentWordImage = null;
    this.imageLoadFailed = true;
  }

  private loadCurrentWordImage(): void {
    this.imageRequest?.unsubscribe();
    this.currentWordImage = null;
    this.imageLoadFailed = false;
    if (!this.isBrowser) return;

    this.imageRequest = this.pixabayImageService.findImage(this.currentWord.translationEnglish).subscribe({
      next: (image) => {
        this.currentWordImage = image;
        this.imageLoadFailed = image === null;
      },
      error: () => {
        this.imageLoadFailed = true;
      },
    });
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

    const isCurrentWord = word.id === this.currentWord.id;
    const previousTodayCount = this.todayCount;
    this.learned.add(word.id);
    const today = this.todayKey;
    this.dailyProgress[today] = [...new Set([...(this.dailyProgress[today] ?? []), word.id])];
    if (previousTodayCount < this.dailyGoal && this.todayCount >= this.dailyGoal) {
      this.showDailyGoalCelebration = true;
    }
    if (isCurrentWord) {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.currentWord = this.words[this.wordIndex];
      this.showAnswer = false;
      this.loadCurrentWordImage();
      if (this.nextWord) this.animateWordTransition();
    }
    this.feedback = this.encouragement;
    this.saveProgress();
  }

  continueAfterDailyGoal(): void {
    this.showDailyGoalCelebration = false;
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

  private get progressStorageKey(): string {
    return `wortzeit-progress-${this.learningLanguage}-v1`;
  }

  private dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private wordNoun(count: number): string {
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'слів';
    const lastDigit = count % 10;
    if (lastDigit === 1) return 'слово';
    if (lastDigit >= 2 && lastDigit <= 4) return 'слова';
    return 'слів';
  }

  private dayNoun(count: number): string {
    const lastTwoDigits = count % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'днів';
    const lastDigit = count % 10;
    if (lastDigit === 1) return 'день';
    if (lastDigit >= 2 && lastDigit <= 4) return 'дні';
    return 'днів';
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
      window.localStorage.setItem(this.progressStorageKey, JSON.stringify(progress));
      this.storageMessage = '';
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage = 'Не вдалося зберегти прогрес. Перевір налаштування сховища браузера.';
        return;
      }
      throw error;
    }
  }

  private saveSettings(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const settings: SavedSettings = {
      learningLanguage: this.learningLanguage,
      theme: this.theme,
    };

    try {
      window.localStorage.setItem('wortzeit-settings-v1', JSON.stringify(settings));
      this.storageMessage = '';
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage = 'Не вдалося зберегти налаштування. Перевір сховище браузера.';
        return;
      }
      throw error;
    }
  }

  private isSavedSettings(value: unknown): value is SavedSettings {
    if (!value || typeof value !== 'object') return false;
    const settings = value as Partial<SavedSettings>;
    return (
      (settings.learningLanguage === 'de' || settings.learningLanguage === 'en') &&
      (settings.theme === 'light' || settings.theme === 'dark')
    );
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
