import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import type { AppTheme, DailyGoal, LearningLanguage } from '../../../core/models/vocabulary.model';

export interface SavedSettings {
  learningLanguage: LearningLanguage;
  theme: AppTheme;
  dailyGoal: DailyGoal;
}

const SETTINGS_KEY = 'wortzeit-settings-v1';
const LEGACY_SETTINGS_KEY = 'deutsch-kompass-settings-v1';
const DAILY_GOALS: DailyGoal[] = [3, 5, 10, 15];

@Injectable({ providedIn: 'root' })
export class LearningSettingsService {
  readonly language = signal<LearningLanguage>('de');
  readonly theme = signal<AppTheme>('light');
  readonly dailyGoal = signal<DailyGoal>(5);
  readonly storageMessage = signal('');
  readonly dailyGoalOptions = DAILY_GOALS;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  restore(): void {
    if (!this.isBrowser) return;

    let saved: string | null;
    try {
      saved = window.localStorage.getItem(SETTINGS_KEY);
      if (!saved) {
        this.migrateLegacySettings();
        saved = window.localStorage.getItem(SETTINGS_KEY);
      }
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage.set('Браузер не дозволив доступ до збережених налаштувань.');
        return;
      }
      throw error;
    }
    if (!saved) return;

    try {
      const settings: unknown = JSON.parse(saved);
      if (!this.isSavedSettings(settings)) {
        this.storageMessage.set(
          'Не вдалося прочитати збережені налаштування. Використано стандартні параметри.',
        );
        return;
      }
      this.language.set(settings.learningLanguage);
      this.theme.set(settings.theme);
      this.dailyGoal.set(
        this.dailyGoalOptions.includes(settings.dailyGoal) ? settings.dailyGoal : 5,
      );
      this.applyTheme();
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.storageMessage.set(
          'Збережені налаштування пошкоджено. Використано стандартні параметри.',
        );
        return;
      }
      throw error;
    }
  }

  setLanguage(language: LearningLanguage): void {
    if (this.language() === language) return;
    this.language.set(language);
    this.save();
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    this.applyTheme();
    this.save();
  }

  setDailyGoal(goal: DailyGoal): void {
    if (this.dailyGoal() === goal) return;
    this.dailyGoal.set(goal);
    this.save();
  }

  applyTheme(): void {
    if (!this.isBrowser) return;
    const theme = this.theme();
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#151c17' : '#fffefa',
    );
  }

  private save(): void {
    if (!this.isBrowser) return;
    const settings: SavedSettings = {
      learningLanguage: this.language(),
      theme: this.theme(),
      dailyGoal: this.dailyGoal(),
    };

    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      this.storageMessage.set('');
    } catch (error) {
      if (error instanceof DOMException) {
        this.storageMessage.set(
          'Не вдалося зберегти налаштування. Перевір сховище браузера.',
        );
        return;
      }
      throw error;
    }
  }

  private migrateLegacySettings(): void {
    const legacySettings = window.localStorage.getItem(LEGACY_SETTINGS_KEY);
    if (!legacySettings) return;

    const parsed: unknown = JSON.parse(legacySettings);
    if (!parsed || typeof parsed !== 'object') return;

    const previousSettings = parsed as {
      translationLanguage?: unknown;
      theme?: unknown;
    };
    this.language.set(previousSettings.translationLanguage === 'en' ? 'en' : 'de');
    if (previousSettings.theme === 'light' || previousSettings.theme === 'dark') {
      this.theme.set(previousSettings.theme);
    }
    this.applyTheme();
    this.save();
  }

  private isSavedSettings(value: unknown): value is SavedSettings {
    if (!value || typeof value !== 'object') return false;
    const settings = value as Partial<SavedSettings>;
    return (
      (settings.learningLanguage === 'de' || settings.learningLanguage === 'en') &&
      (settings.theme === 'light' || settings.theme === 'dark') &&
      (typeof settings.dailyGoal === 'number'
        ? DAILY_GOALS.includes(settings.dailyGoal as DailyGoal)
        : true)
    );
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
