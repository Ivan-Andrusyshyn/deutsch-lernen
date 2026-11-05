import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  AppTheme,
  DailyGoal,
  LearningLanguage,
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
import { LearningProgressService } from '../../services/learning-progress.service';
import { LearningSettingsService } from '../../services/learning-settings.service';
import { phrasesFor, readingTextsFor } from '../../data/learning-materials';
import { vocabulary } from '../../data/vocabulary';
import { VocabularyCardComponent } from '../../../../shared/components/vocabulary-card/vocabulary-card.component';
import { LearningWordCardComponent } from '../../components/learning-word-card/learning-word-card.component';

type LearningTab = 'words' | 'phrases' | 'texts';

function wordCountLabel(count: number, grammaticalCase: 'nominative' | 'genitive'): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;
  if (grammaticalCase === 'nominative') {
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} слів`;
    if (lastDigit === 1) return `${count} слово`;
    if (lastDigit >= 2 && lastDigit <= 4) return `${count} слова`;
    return `${count} слів`;
  }
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} слів`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} слова`;
  return `${count} слів`;
}

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
export class LearningPageComponent {
  readonly words = vocabulary;
  readonly favoritesFilter = 'Обране';
  readonly categories = [
    'Усі слова',
    this.favoritesFilter,
    ...new Set(vocabulary.map((word) => word.category)),
  ];
  readonly encouragements = [
    'Чудова робота! Кожен крок наближає тебе до мети.',
    'Супер! Це слово вже у твоєму активному словнику.',
    'Так тримати! Регулярна практика — найкращий шлях до успіху.',
    'Чудово! Сьогодні ти помітно просунувся(-лася).',
    'Молодець! Ще одне слово тепер твоє.',
  ];

  readonly settings = inject(LearningSettingsService);
  readonly progress = inject(LearningProgressService);
  private readonly calendarService = inject(LearningCalendarService);
  private readonly wordIds = new Set(vocabulary.map((word) => word.id));

  private readonly activeTabSignal = signal<LearningTab>('words');
  private readonly activeCategorySignal = signal('Усі слова');
  private readonly searchQuerySignal = signal('');
  private readonly wordPageSizeSignal = signal<WordPageSize>(10);
  private readonly wordPageSignal = signal(1);
  private readonly showAnswerSignal = signal(false);
  private readonly feedbackSignal = signal('');
  private readonly openTextSignal = signal(-1);
  private readonly wordIndexSignal = signal(0);
  private readonly currentWordSignal = signal<WordCard>(vocabulary.find((word) => word.level === 'A2')!);

  get selectedWords(): WordCard[] {
    return vocabulary.filter((word) => word.level === this.settings.level());
  }

  private readonly visibleWordsList = computed(() => {
    const query = this.searchQuerySignal().trim().toLocaleLowerCase('uk');
    const category = this.activeCategorySignal();
    const language = this.settings.language();
    const favorites = this.progress.favorites();

    return this.selectedWords.filter((word) => {
      const matchesCategory =
        category === 'Усі слова' ||
        (category === this.favoritesFilter
          ? favorites.has(word.id)
          : word.category === category);
      const matchesQuery =
        !query ||
        this.displayWord(word).toLocaleLowerCase(language).includes(query) ||
        word.translationEnglish.toLocaleLowerCase('en').includes(query) ||
        word.translation.toLocaleLowerCase('uk').includes(query) ||
        word.word.toLocaleLowerCase('de').includes(query);
      return matchesCategory && matchesQuery;
    });
  });

  readonly paginatedWords = computed(() => {
    const start = (this.wordPageSignal() - 1) * this.wordPageSizeSignal();
    return this.visibleWordsList().slice(start, start + this.wordPageSizeSignal());
  });

  readonly wordPageCount = computed(() =>
    Math.max(1, Math.ceil(this.visibleWordsList().length / this.wordPageSizeSignal())),
  );

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {
    afterNextRender(() => {
      this.settings.restore();
      this.progress.restore(this.settings.language(), this.wordIds);
      this.resetCurrentWord();
    });
  }

  get activeTab(): LearningTab {
    return this.activeTabSignal();
  }
  set activeTab(value: LearningTab) {
    this.activeTabSignal.set(value);
  }

  get learningLanguage(): LearningLanguage {
    return this.settings.language();
  }

  get theme(): AppTheme {
    return this.settings.theme();
  }
  set theme(value: AppTheme) {
    this.settings.theme.set(value);
    this.settings.applyTheme();
  }

  get dailyGoal(): DailyGoal {
    return this.settings.dailyGoal();
  }

  get activeCategory(): string {
    return this.activeCategorySignal();
  }
  set activeCategory(value: string) {
    this.activeCategorySignal.set(value);
  }

  get searchQuery(): string {
    return this.searchQuerySignal();
  }
  set searchQuery(value: string) {
    this.searchQuerySignal.set(value);
  }

  get wordPageSize(): WordPageSize {
    return this.wordPageSizeSignal();
  }

  get wordPage(): number {
    return this.wordPageSignal();
  }
  set wordPage(value: number) {
    this.wordPageSignal.set(value);
  }

  get learned(): Set<string> {
    return this.progress.learned();
  }
  set learned(value: Set<string>) {
    this.progress.learned.set(value);
  }

  get favorites(): Set<string> {
    return this.progress.favorites();
  }

  get dailyProgress(): Record<string, string[]> {
    return this.progress.dailyProgress();
  }

  get currentWord(): WordCard {
    return this.currentWordSignal();
  }
  set currentWord(value: WordCard) {
    this.currentWordSignal.set(value);
  }

  get showAnswer(): boolean {
    return this.showAnswerSignal();
  }
  set showAnswer(value: boolean) {
    this.showAnswerSignal.set(value);
  }

  get feedback(): string {
    return this.feedbackSignal();
  }
  set feedback(value: string) {
    this.feedbackSignal.set(value);
  }

  get storageMessage(): string {
    return this.settings.storageMessage() || this.progress.storageMessage();
  }

  get showDailyGoalCelebration(): boolean {
    return this.progress.showDailyGoalCelebration();
  }

  get openText(): number {
    return this.openTextSignal();
  }
  set openText(value: number) {
    this.openTextSignal.set(value);
  }

  get wordIndex(): number {
    return this.wordIndexSignal();
  }
  set wordIndex(value: number) {
    this.wordIndexSignal.set(value);
  }

  get visibleWords(): WordCard[] {
    return this.visibleWordsList();
  }

  get phrases(): Phrase[] {
    return phrasesFor(this.learningLanguage);
  }

  get readingTexts(): ReadingText[] {
    return readingTextsFor(this.learningLanguage);
  }

  get learnedCount(): number {
    return this.selectedLearnedCount;
  }

  get progressPercent(): number {
    if (this.selectedLearnedCount === 0) return 0;
    return Math.max(1, Math.round((this.selectedLearnedCount / this.selectedWords.length) * 100));
  }

  get selectedLearnedCount(): number {
    return this.selectedWords.filter((word) => this.learned.has(word.id)).length;
  }

  get selectedFavoriteCount(): number {
    return this.selectedWords.filter((word) => this.favorites.has(word.id)).length;
  }

  get selectedWordCountLabel(): string {
    return wordCountLabel(this.selectedWords.length, 'nominative');
  }

  get selectedWordCountGenitive(): string {
    return wordCountLabel(this.selectedWords.length, 'genitive');
  }

  get todayCount(): number {
    return this.progress.todayCount();
  }

  get streak(): number {
    return this.progress.streak();
  }

  get progressMessage(): string {
    const language = this.learningLanguageName.toLocaleLowerCase('uk');
    if (this.progressPercent === 100)
      return `Усі ${this.selectedWordCountGenitive} ${language} вивчено — це неймовірно!`;
    if (this.selectedLearnedCount === 0) return 'Почни з першого слова — у тебе все вийде!';
    if (this.todayCount >= this.dailyGoal) return 'Денну ціль виконано. Ти неймовірний(-а)!';
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

  trackWord(_index: number, word: WordCard): string {
    return word.id;
  }

  setLearningLanguage(language: LearningLanguage): void {
    if (this.learningLanguage === language) return;
    this.settings.setLanguage(language);
    this.wordPageSignal.set(1);
    this.showAnswerSignal.set(false);
    this.feedbackSignal.set('');
    this.settings.storageMessage.set('');
    this.progress.restore(language, this.wordIds);
    this.resetCurrentWord();
  }

  setLearningLevel(level: 'A2' | 'B1'): void {
    if (this.settings.level() === level) return;
    this.settings.setLevel(level);
    this.wordPageSignal.set(1);
    this.activeCategorySignal.set('Усі слова');
    this.searchQuerySignal.set('');
    this.resetCurrentWord();
  }

  toggleTheme(): void {
    this.settings.toggleTheme();
  }

  setDailyGoal(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    if (value === 3 || value === 5 || value === 10 || value === 15) {
      this.settings.setDailyGoal(value);
    }
  }

  selectTab(tab: LearningTab): void {
    this.activeTabSignal.set(tab);
    this.feedbackSignal.set('');
  }

  selectWordCategory(category: string): void {
    this.activeCategorySignal.set(category);
    this.wordPageSignal.set(1);
  }

  onWordSearchChange(): void {
    this.wordPageSignal.set(1);
  }

  setWordPageSize(size: WordPageSize): void {
    this.wordPageSizeSignal.set(size);
    this.wordPageSignal.set(1);
  }

  onWordPageSizeChange(size: WordPageSize): void {
    this.setWordPageSize(size);
  }

  setWordPage(page: number): void {
    this.wordPageSignal.set(Math.max(1, Math.min(page, this.wordPageCount())));
  }

  startLearning(): void {
    this.activeTabSignal.set('words');
    this.activeCategorySignal.set('Усі слова');
    this.searchQuerySignal.set('');
    this.wordPageSignal.set(1);

    const next = this.nextUnlearnedWord();
    if (next) {
      this.setCurrentWord(this.selectedWords.indexOf(next));
    } else {
      this.setCurrentWord(0);
      this.feedbackSignal.set(
        'Ти вивчив(-ла) весь словник! Повтори обрані слова або обери іншу мову навчання.',
      );
    }
    if (isPlatformBrowser(this.platformId)) {
      document
        .getElementById('learning')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  showPreviousWord(): void {
    this.setCurrentWord((this.wordIndex - 1 + this.selectedWords.length) % this.selectedWords.length);
  }

  showNextWord(): void {
    this.setCurrentWord((this.wordIndex + 1) % this.selectedWords.length);
  }

  markLearned(word: WordCard): void {
    const isCurrentWord = word.id === this.currentWord.id;
    const result = this.progress.markLearned(word.id, this.dailyGoal);
    if (result === 'already') {
      if (isCurrentWord) {
        this.advanceToNextUnlearnedWord(this.wordIndex);
      } else {
        this.feedbackSignal.set('Це слово вже позначено як вивчене.');
      }
      return;
    }
    if (isCurrentWord) {
      this.advanceToNextUnlearnedWord(this.wordIndex);
    }
    this.feedbackSignal.set(this.encouragement);
    this.progress.save(this.learningLanguage);
  }

  continueAfterDailyGoal(): void {
    this.progress.continueAfterDailyGoal();
  }

  toggleFavorite(word: WordCard): void {
    this.progress.toggleFavorite(word.id);
    this.progress.save(this.learningLanguage);
  }

  isFavorite(word: WordCard): boolean {
    return this.favorites.has(word.id);
  }

  isLearned(word: WordCard): boolean {
    return this.learned.has(word.id);
  }

  toggleAnswer(): void {
    this.showAnswerSignal.update((value) => !value);
  }

  toggleText(index: number): void {
    this.openTextSignal.set(this.openText === index ? -1 : index);
  }

  showPhraseFeedback(phrase: Phrase): void {
    this.feedbackSignal.set(`Чудово! Повтори вголос: «${phrase.text}»`);
  }

  showTextFeedback(text: ReadingText): void {
    this.feedbackSignal.set(`Ти прочитав(-ла) текст «${text.title}» — чудовий крок!`);
  }

  private setCurrentWord(index: number): void {
    this.wordIndexSignal.set(index);
    this.currentWordSignal.set(this.selectedWords[index]);
    this.showAnswerSignal.set(false);
    this.feedbackSignal.set('');
  }

  private resetCurrentWord(): void {
    const next = this.nextUnlearnedWord() ?? this.selectedWords[0];
    this.currentWordSignal.set(next);
    this.wordIndexSignal.set(this.selectedWords.indexOf(next));
    this.showAnswerSignal.set(false);
  }

  private nextUnlearnedWord(): WordCard | undefined {
    return this.selectedWords.find((word) => !this.learned.has(word.id));
  }

  private advanceToNextUnlearnedWord(currentIndex: number): void {
    const words = this.selectedWords;
    for (let offset = 1; offset <= words.length; offset += 1) {
      const nextIndex = (currentIndex + offset) % words.length;
      if (!this.learned.has(words[nextIndex].id)) {
        this.setCurrentWord(nextIndex);
        return;
      }
    }
  }
}
