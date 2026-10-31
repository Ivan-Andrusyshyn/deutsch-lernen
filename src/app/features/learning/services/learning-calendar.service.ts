import { Injectable } from '@angular/core';
import type { WordCard } from '../../../core/models/vocabulary.model';

export interface CalendarDay {
  key: string;
  day: number;
  count: number;
  intensity: 'none' | 'low' | 'medium' | 'high';
  isToday: boolean;
  isSelected: boolean;
  isFuture: boolean;
}

export interface CalendarMonthSummary {
  activeDays: number;
  learnedWords: number;
}

@Injectable({ providedIn: 'root' })
export class LearningCalendarService {
  readonly weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  dateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getMonthLabel(month: Date): string {
    return month.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
  }

  getCalendarDays(
    month: Date,
    selectedDateKey: string,
    dailyProgress: Record<string, string[]>,
    today = new Date(),
  ): (CalendarDay | null)[] {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
    const todayKey = this.dateKey(today);

    return Array.from({ length: cellCount }, (_, index) => {
      const day = index - firstWeekday + 1;
      if (day < 1 || day > daysInMonth) return null;

      const key = this.dateKey(new Date(year, monthIndex, day));
      const count = new Set(dailyProgress[key] ?? []).size;
      const intensity: CalendarDay['intensity'] =
        count === 0 ? 'none' : count <= 2 ? 'low' : count <= 4 ? 'medium' : 'high';

      return {
        key,
        day,
        count,
        intensity,
        isToday: key === todayKey,
        isSelected: key === selectedDateKey,
        isFuture: key > todayKey,
      };
    });
  }

  getSelectedDateLabel(dateKey: string): string {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('uk-UA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getWordsForDate(dateKey: string, dailyProgress: Record<string, string[]>, words: WordCard[]): WordCard[] {
    const learnedIds = new Set(dailyProgress[dateKey] ?? []);
    return words.filter((word) => learnedIds.has(word.id));
  }

  getMonthSummary(month: Date, dailyProgress: Record<string, string[]>): CalendarMonthSummary {
    const monthPrefix = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-`;
    const days = Object.entries(dailyProgress).filter(
      ([date, ids]) => date.startsWith(monthPrefix) && ids.length > 0,
    );

    return {
      activeDays: days.length,
      learnedWords: days.reduce((total, [, ids]) => total + new Set(ids).size, 0),
    };
  }

  canNavigateToNextMonth(month: Date, today = new Date()): boolean {
    return month.getFullYear() < today.getFullYear() ||
      (month.getFullYear() === today.getFullYear() && month.getMonth() < today.getMonth());
  }

  getStreak(dailyProgress: Record<string, string[]>, today = new Date()): number {
    const activityDates = new Set(
      Object.keys(dailyProgress).filter((date) => new Set(dailyProgress[date]).size > 0),
    );
    const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!activityDates.has(this.dateKey(cursor))) {
      cursor.setDate(cursor.getDate() - 1);
    }

    let streak = 0;
    while (activityDates.has(this.dateKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
}
