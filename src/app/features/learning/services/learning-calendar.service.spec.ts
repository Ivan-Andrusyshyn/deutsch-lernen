import { LearningCalendarService } from './learning-calendar.service';
import { vocabulary } from '../data/vocabulary';

describe('LearningCalendarService', () => {
  let service: LearningCalendarService;

  beforeEach(() => {
    service = new LearningCalendarService();
  });

  it('creates a Monday-first month grid and counts unique learned words', () => {
    const days = service.getCalendarDays(
      new Date(2026, 9, 1),
      '2026-10-02',
      {
        '2026-10-01': [vocabulary[0].id],
        '2026-10-02': [vocabulary[0].id, vocabulary[1].id, vocabulary[1].id],
        '2026-10-03': vocabulary.slice(0, 5).map((word) => word.id),
      },
      new Date(2026, 9, 3),
    );

    expect(days[0]).toBeNull();
    expect(days.find((day) => day?.key === '2026-10-01')?.intensity).toBe('low');
    expect(days.find((day) => day?.key === '2026-10-02')?.count).toBe(2);
    expect(days.find((day) => day?.key === '2026-10-02')?.isSelected).toBeTrue();
    expect(days.find((day) => day?.key === '2026-10-03')?.intensity).toBe('high');
  });

  it('summarizes monthly activity, resolves words, and blocks future navigation', () => {
    const progress = {
      '2026-10-01': [vocabulary[0].id],
      '2026-10-02': [vocabulary[0].id, vocabulary[1].id],
      '2026-09-30': [vocabulary[2].id],
    };
    const october = new Date(2026, 9, 1);

    expect(service.getMonthSummary(october, progress)).toEqual({ activeDays: 2, learnedWords: 3 });
    expect(service.getWordsForDate('2026-10-02', progress, vocabulary)).toEqual(vocabulary.slice(0, 2));
    expect(service.canNavigateToNextMonth(october, new Date(2026, 9, 15))).toBeFalse();
    expect(service.canNavigateToNextMonth(october, new Date(2026, 10, 1))).toBeTrue();
  });

  it('calculates the active streak from today or the previous day', () => {
    expect(service.getStreak({
      '2026-10-01': [vocabulary[0].id],
      '2026-10-02': [vocabulary[1].id],
      '2026-10-03': [vocabulary[2].id],
    }, new Date(2026, 9, 3))).toBe(3);

    expect(service.getStreak({
      '2026-10-02': [vocabulary[1].id],
      '2026-10-03': [],
    }, new Date(2026, 9, 3))).toBe(1);
  });
});
