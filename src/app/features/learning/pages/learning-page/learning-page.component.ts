import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  Phrase,
  ReadingText,
  WordCard,
} from '../../../../core/models/vocabulary.model';
import { LearningCalendarComponent } from '../../components/learning-calendar/learning-calendar.component';
import {
  WordPaginationComponent,
  type WordPageSize,
} from '../../components/word-pagination/word-pagination.component';
import { LearningCalendarService } from '../../services/learning-calendar.service';
import { phrases, readingTexts, vocabulary } from '../../data/vocabulary';
import { VocabularyCardComponent } from '../../../../shared/components/vocabulary-card/vocabulary-card.component';
import { LearningWordCardComponent } from '../../components/learning-word-card/learning-word-card.component';

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
@Component({
  selector: 'app-learning-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LearningCalendarComponent,
    LearningWordCardComponent,
    VocabularyCardComponent,
    WordPaginationComponent,
  ],
  templateUrl: './learning-page.component.html',
  styleUrl: './learning-page.component.css',
})
export class LearningPageComponent implements OnInit {
  readonly words = vocabulary;
  readonly phrases = phrases;
  readonly readingTexts = readingTexts;
  readonly dailyGoal = 5;
  readonly categories = [
    'Усі слова',
    ...new Set(vocabulary.map((word) => word.category)),
  ];
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
  currentWord = vocabulary[0];
  showAnswer = false;
  feedback = '';
  storageMessage = '';
  showDailyGoalCelebration = false;
  openText = -1;
  wordIndex = 0;
  private isBrowser = false;
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly calendarService: LearningCalendarService,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.restoreSettings();
        this.restoreProgress();
      }, 0);
    }
  }

  private restoreSettings(): void {
    let saved: string | null;
    try {
      saved = window.localStorage.getItem('wortzeit-settings-v1');
      if (!saved) {
        const legacySettings = window.localStorage.getItem(
          'deutsch-kompass-settings-v1',
        );
        if (legacySettings) {
          const parsed: unknown = JSON.parse(legacySettings);
          if (parsed && typeof parsed === 'object') {
            const previousSettings = parsed as {
              translationLanguage?: unknown;
              theme?: unknown;
            };
            this.learningLanguage =
              previousSettings.translationLanguage === 'en' ? 'en' : 'de';
            if (
              previousSettings.theme === 'light' ||
              previousSettings.theme === 'dark'
            ) {
              this.theme = previousSettings.theme;
            }
            this.saveSettings();
          }
        }
      }
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage =
          'Браузер не дозволив доступ до збережених налаштувань.';
        return;
      }
      if (error instanceof SyntaxError) {
        this.storageMessage =
          'Збережені налаштування пошкоджено. Використано стандартні параметри.';
        return;
      }
      throw error;
    }
    if (!saved) return;

    try {
      const settings: unknown = JSON.parse(saved);
      if (!this.isSavedSettings(settings)) {
        this.storageMessage =
          'Не вдалося прочитати збережені налаштування. Використано стандартні параметри.';
        return;
      }
      this.learningLanguage = settings.learningLanguage;
      this.theme = settings.theme;
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.storageMessage =
          'Збережені налаштування пошкоджено. Використано стандартні параметри.';
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
        this.storageMessage =
          'Не вдалося прочитати збережений прогрес. Спробуй почати нове заняття.';
        return;
      }
      this.learned = new Set(
        progress.learned.filter((id) =>
          this.words.some((word) => word.id === id),
        ),
      );
      this.favorites = new Set(
        progress.favorites.filter((id) =>
          this.words.some((word) => word.id === id),
        ),
      );
      this.dailyProgress = Object.fromEntries(
        Object.entries(progress.dailyProgress).map(([date, ids]) => [
          date,
          ids.filter((id) => this.words.some((word) => word.id === id)),
        ]),
      );
      this.currentWord = this.nextUnlearnedWord() ?? this.words[0];
      this.wordIndex = this.words.indexOf(this.currentWord);
      if (
        this.learningLanguage === 'de' &&
        !window.localStorage.getItem(this.progressStorageKey)
      ) {
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
      const matchesCategory =
        this.activeCategory === 'Усі слова' ||
        word.category === this.activeCategory;
      const matchesQuery =
        !query ||
        this.displayWord(word)
          .toLocaleLowerCase(this.learningLanguage)
          .includes(query) ||
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

  get learnedCount(): number {
    return this.learned.size;
  }

  get progressPercent(): number {
    if (this.learnedCount === 0) return 0;
    return Math.max(
      1,
      Math.round((this.learnedCount / this.words.length) * 100),
    );
  }

  get todayCount(): number {
    return this.dailyProgress[this.todayKey]?.length ?? 0;
  }

  get streak(): number {
    return this.calendarService.getStreak(this.dailyProgress);
  }

  get progressMessage(): string {
    const language = this.learningLanguageName.toLocaleLowerCase('uk');
    if (this.progressPercent === 100)
      return `Усі ${this.words.length} слів ${language} вивчено — це неймовірно!`;
    if (this.learnedCount === 0)
      return 'Почни з першого слова — у тебе все вийде!';
    if (this.todayCount >= this.dailyGoal)
      return 'Денну ціль виконано. Ти неймовірний(-а)!';
    return `Маленькі кроки щодня — і ${language} стане звичкою.`;
  }

  get encouragement(): string {
    return this.encouragements[
      (this.learnedCount + this.todayCount) % this.encouragements.length
    ];
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

  onWordPageSizeChange(size: WordPageSize): void {
    this.setWordPageSize(size);
  }

  setWordPage(page: number): void {
    const pageCount = Math.max(
      1,
      Math.ceil(this.visibleWords.length / this.wordPageSize),
    );
    this.wordPage = Math.max(1, Math.min(page, pageCount));
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
    } else {
      this.currentWord = this.words[0];
      this.wordIndex = 0;
      this.showAnswer = false;
      this.feedback =
        'Ти вивчив(-ла) весь словник! Повтори обрані слова або обери іншу мову навчання.';
    }
    if (isPlatformBrowser(this.platformId)) {
      document
        .getElementById('learning')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showPreviousWord(): void {
    this.setCurrentWord(
      (this.wordIndex - 1 + this.words.length) % this.words.length,
    );
  }

  showNextWord(): void {
    this.setCurrentWord((this.wordIndex + 1) % this.words.length);
  }

  private setCurrentWord(index: number): void {
    this.wordIndex = index;
    this.currentWord = this.words[index];
    this.showAnswer = false;
    this.feedback = '';
  }

  markLearned(word: WordCard): void {
    // if (this.learned.has(word.id)) {
    //   this.feedback = 'Це слово вже позначено як вивчене. Чудова робота!';
    //   return;
    // }

    const isCurrentWord = word.id === this.currentWord.id;
    const previousTodayCount = this.todayCount;
    this.learned.add(word.id);
    const today = this.todayKey;
    this.dailyProgress[today] = [
      ...new Set([...(this.dailyProgress[today] ?? []), word.id]),
    ];
    if (
      previousTodayCount < this.dailyGoal &&
      this.todayCount >= this.dailyGoal
    ) {
      this.showDailyGoalCelebration = true;
    }
    if (isCurrentWord) {
      this.wordIndex = (this.wordIndex + 1) % this.words.length;
      this.currentWord = this.words[this.wordIndex];
      this.showAnswer = false;
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

  private get progressStorageKey(): string {
    return `wortzeit-progress-${this.learningLanguage}-v1`;
  }

  private get todayKey(): string {
    return this.calendarService.dateKey(new Date());
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
      window.localStorage.setItem(
        this.progressStorageKey,
        JSON.stringify(progress),
      );
      this.storageMessage = '';
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage =
          'Не вдалося зберегти прогрес. Перевір налаштування сховища браузера.';
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
      window.localStorage.setItem(
        'wortzeit-settings-v1',
        JSON.stringify(settings),
      );
      this.storageMessage = '';
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage =
          'Не вдалося зберегти налаштування. Перевір сховище браузера.';
        return;
      }
      throw error;
    }
  }

  private isSavedSettings(value: unknown): value is SavedSettings {
    if (!value || typeof value !== 'object') return false;
    const settings = value as Partial<SavedSettings>;
    return (
      (settings.learningLanguage === 'de' ||
        settings.learningLanguage === 'en') &&
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
        (ids) =>
          Array.isArray(ids) && ids.every((id) => typeof id === 'string'),
      )
    );
  }
}
