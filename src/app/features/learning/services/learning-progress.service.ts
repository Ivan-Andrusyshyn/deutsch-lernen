import { Injectable, Inject, PLATFORM_ID, computed, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { LearningLanguage } from '../../../core/models/vocabulary.model';
import { LearningCalendarService } from './learning-calendar.service';

interface SavedProgress {
  learned: string[];
  favorites: string[];
  dailyProgress: Record<string, string[]>;
}

@Injectable({ providedIn: 'root' })
export class LearningProgressService {
  readonly learned = signal<Set<string>>(new Set());
  readonly favorites = signal<Set<string>>(new Set());
  readonly dailyProgress = signal<Record<string, string[]>>({});
  readonly showDailyGoalCelebration = signal(false);
  readonly storageMessage = signal('');

  readonly learnedCount = computed(() => this.learned().size);
  readonly todayCount = computed(
    () => this.dailyProgress()[this.todayKey]?.length ?? 0,
  );
  readonly streak = computed(() =>
    this.calendarService.getStreak(this.dailyProgress()),
  );

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly calendarService: LearningCalendarService,
  ) {}

  restore(language: LearningLanguage, validIds: Set<string>): void {
    if (!this.isBrowser) return;

    this.learned.set(new Set());
    this.favorites.set(new Set());
    this.dailyProgress.set({});
    this.showDailyGoalCelebration.set(false);

    let saved: string | null;
    try {
      saved = window.localStorage.getItem(this.progressKey(language));
      if (!saved && language === 'de') {
        saved = window.localStorage.getItem('deutsch-kompass-progress-v1');
      }
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage.set('Браузер не дозволив доступ до збережених даних.');
        return;
      }
      throw error;
    }
    if (!saved) return;

    try {
      const progress: unknown = JSON.parse(saved);
      if (!this.isSavedProgress(progress)) {
        this.storageMessage.set(
          'Не вдалося прочитати збережений прогрес. Спробуй почати нове заняття.',
        );
        return;
      }

      this.learned.set(new Set(progress.learned.filter((id) => validIds.has(id))));
      this.favorites.set(new Set(progress.favorites.filter((id) => validIds.has(id))));
      this.dailyProgress.set(
        Object.fromEntries(
          Object.entries(progress.dailyProgress).map(([date, ids]) => [
            date,
            ids.filter((id) => validIds.has(id)),
          ]),
        ),
      );

      if (language === 'de' && !window.localStorage.getItem(this.progressKey(language))) {
        this.save(language);
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.storageMessage.set('Збережений прогрес пошкоджено. Дані не змінено.');
        return;
      }
      throw error;
    }
  }

  markLearned(
    wordId: string,
    dailyGoal: number,
    levelWordIds?: ReadonlySet<string>,
  ): 'already' | 'learned' {
    if (this.learned().has(wordId)) {
      return 'already';
    }

    const today = this.todayKey;
    const previousTodayIds = this.dailyProgress()[today] ?? [];
    const previousTodayCount = levelWordIds
      ? new Set(previousTodayIds.filter((id) => levelWordIds.has(id))).size
      : new Set(previousTodayIds).size;
    this.learned.update((ids) => new Set(ids).add(wordId));

    const todayIds = [...new Set([...(this.dailyProgress()[today] ?? []), wordId])];
    this.dailyProgress.update((progress) => ({ ...progress, [today]: todayIds }));

    const currentTodayCount = levelWordIds
      ? new Set(todayIds.filter((id) => levelWordIds.has(id))).size
      : todayIds.length;
    if (previousTodayCount < dailyGoal && currentTodayCount >= dailyGoal) {
      this.showDailyGoalCelebration.set(true);
    }
    return 'learned';
  }

  toggleFavorite(wordId: string): void {
    this.favorites.update((ids) => {
      const next = new Set(ids);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
  }

  continueAfterDailyGoal(): void {
    this.showDailyGoalCelebration.set(false);
  }

  save(language: LearningLanguage): void {
    if (!this.isBrowser) return;
    const progress: SavedProgress = {
      learned: [...this.learned()],
      favorites: [...this.favorites()],
      dailyProgress: this.dailyProgress(),
    };

    try {
      window.localStorage.setItem(this.progressKey(language), JSON.stringify(progress));
      this.storageMessage.set('');
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage.set(
          'Не вдалося зберегти прогрес. Перевір налаштування сховища браузера.',
        );
        return;
      }
      throw error;
    }
  }

  private progressKey(language: LearningLanguage): string {
    return `wortzeit-progress-${language}-v1`;
  }

  private get todayKey(): string {
    return this.calendarService.dateKey(new Date());
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

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
