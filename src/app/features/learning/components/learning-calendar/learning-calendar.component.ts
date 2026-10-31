import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { WordCard } from '../../../../core/models/vocabulary.model';
import { LearningCalendarService, type CalendarDay } from '../../services/learning-calendar.service';

@Component({
  selector: 'app-learning-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learning-calendar.component.html',
})
export class LearningCalendarComponent {
  @Input({ required: true }) dailyProgress: Record<string, string[]> = {};
  @Input({ required: true }) words: WordCard[] = [];
  @Input({ required: true }) language: 'de' | 'en' = 'de';

  readonly weekdays = this.calendarService.weekdays;
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  selectedDateKey = this.calendarService.dateKey(new Date());

  constructor(private readonly calendarService: LearningCalendarService) {}

  get calendarMonthLabel(): string {
    return this.calendarService.getMonthLabel(this.calendarMonth);
  }

  get calendarDays(): (CalendarDay | null)[] {
    return this.calendarService.getCalendarDays(this.calendarMonth, this.selectedDateKey, this.dailyProgress);
  }

  get selectedDayLabel(): string {
    return this.calendarService.getSelectedDateLabel(this.selectedDateKey);
  }

  get selectedDayWords(): WordCard[] {
    return this.calendarService.getWordsForDate(this.selectedDateKey, this.dailyProgress, this.words);
  }

  get selectedDayCountLabel(): string {
    const count = this.selectedDayWords.length;
    return `${count} ${this.wordNoun(count)}`;
  }

  get canGoToNextMonth(): boolean {
    return this.calendarService.canNavigateToNextMonth(this.calendarMonth);
  }

  get monthActiveDaysLabel(): string {
    const count = this.calendarService.getMonthSummary(this.calendarMonth, this.dailyProgress).activeDays;
    return `${count} ${this.dayNoun(count)} навчання`;
  }

  get monthWordCountLabel(): string {
    const count = this.calendarService.getMonthSummary(this.calendarMonth, this.dailyProgress).learnedWords;
    return `${count} ${this.wordNoun(count)}`;
  }

  changeMonth(offset: -1 | 1): void {
    if (offset > 0 && !this.canGoToNextMonth) return;

    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + offset,
      1,
    );
    this.selectedDateKey = this.calendarService.dateKey(this.calendarMonth);
  }

  selectDay(day: CalendarDay): void {
    if (day.isFuture) return;
    this.selectedDateKey = day.key;
  }

  displayWord(word: WordCard): string {
    return this.language === 'de' ? word.word : word.translationEnglish;
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
}
