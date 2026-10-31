import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { PixabayImageService } from '../../../../core/services/pixabay-image.service';
import { LearningPageComponent } from './learning-page.component';
import { phrases, readingTexts, vocabulary } from '../../data/vocabulary';

describe('LearningPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningPageComponent],
      providers: [{
        provide: PixabayImageService,
        useValue: { findImage: () => of(null) },
      }],
    }).compileComponents();
  });

  it('renders the Ukrainian app with two clearly labeled study languages', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Дві мови');
    expect(compiled.querySelector('.total-pill')?.textContent).toContain('1000 слів');
    expect(compiled.querySelector('.learning-language-picker')?.textContent).toContain('Німецьку');
    expect(compiled.querySelector('.learning-language-picker')?.textContent).toContain('Англійську');
    expect(compiled.querySelectorAll('.language-option-text small')[0].textContent).toContain('1000 слів');
    expect(compiled.querySelectorAll('.language-option-text small')[1].textContent).toContain('1000 слів');
  });

  it('switches the study word while keeping the Ukrainian meaning and category', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;
    const word = vocabulary[0];
    const germanWord = word.word;
    const ukrainianTranslation = word.translation;
    const category = word.category;

    expect(app.displayWord(word)).toBe(germanWord);
    expect(app.displayTranslation(word)).toBe(ukrainianTranslation);
    app.searchQuery = 'apartment';
    expect(app.visibleWords).toContain(word);
    app.setLearningLanguage('en');

    expect(app.displayWord(word)).toBe('the apartment');
    expect(app.displayTranslation(word)).toBe(ukrainianTranslation);
    expect(word.word).toBe(germanWord);
    expect(word.translation).toBe(ukrainianTranslation);
    expect(word.category).toBe(category);
    app.searchQuery = 'apartment';
    expect(app.visibleWords).toContain(word);
  });

  it('updates the study language in the UI and keeps German-only materials out of English mode', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const languageButton = compiled.querySelector('.learning-language-switch button:nth-child(2)') as HTMLButtonElement;
    languageButton.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.daily-word h3')?.textContent?.trim()).toBe('the apartment');
    expect(compiled.querySelector('.vocab-translation')?.textContent?.trim()).toBe('квартира');
    expect(languageButton.getAttribute('aria-pressed')).toBe('true');
    expect(compiled.querySelector('.english-mode-note')?.textContent).toContain('Фрази й тексти поки доступні лише в режимі німецької');
    expect(compiled.querySelector('.tab-list')?.textContent).not.toContain('Фрази');

    const themeButton = compiled.querySelector('.theme-toggle') as HTMLButtonElement;
    themeButton.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.app-shell')?.classList.contains('theme-dark')).toBeTrue();
    expect(themeButton.getAttribute('aria-label')).toBe('Увімкнути світлу тему');
  });

  it('makes the learning card position, answer, and navigation controls explicit', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.word-card-position')?.textContent).toContain('Картка 1 з 1000');
    expect(compiled.querySelector('.hidden-hint')?.textContent).toContain('Згадай значення');
    expect(compiled.querySelector('.daily-actions .primary-button')?.textContent).toContain('Я запам’ятав(-ла)');
    expect(compiled.querySelector('.slider-button-label')?.textContent).toContain('Назад');
    expect(compiled.querySelectorAll('.slider-button-label')[1]?.textContent).toContain('Далі');

    (compiled.querySelector('.daily-actions .outline-button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.translation-label')?.textContent).toBe('Українською');
    expect(compiled.querySelector('.translation-reveal .word-hint')?.textContent).toContain('квартира');
  });

  it('loads the learning-card photo with the English word', fakeAsync(() => {
    const imageService = TestBed.inject(PixabayImageService);
    const findImage = spyOn(imageService, 'findImage').and.returnValue(of(null));
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    tick(0);
    fixture.detectChanges();

    expect(findImage).toHaveBeenCalledWith(vocabulary[0].translationEnglish);
    expect((fixture.nativeElement as HTMLElement).querySelector('.word-photo')?.textContent)
      .toContain(vocabulary[0].translationEnglish);
    fixture.destroy();
  }));

  it('paginates the vocabulary and applies the selected page size', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.word-grid app-vocabulary-card').length).toBe(10);
    (compiled.querySelector('[aria-label="Сторінка 2"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(compiled.querySelector('.word-grid h4')?.textContent?.trim()).toBe(
      fixture.componentInstance.displayWord(vocabulary[10]),
    );

    const pageSize = compiled.querySelector('.page-size-control select') as HTMLSelectElement;
    pageSize.value = '20';
    pageSize.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.word-grid app-vocabulary-card').length).toBe(20);
    expect(compiled.querySelector('.word-range')?.textContent).toContain('1–20');

    fixture.componentInstance.setWordPage(4);
    fixture.componentInstance.selectWordCategory(fixture.componentInstance.categories[1]);
    expect(fixture.componentInstance.wordPage).toBe(1);
    fixture.destroy();
  });

  it('persists and restores study language and theme settings', fakeAsync(() => {
    window.localStorage.removeItem('wortzeit-settings-v1');
    window.localStorage.removeItem('deutsch-kompass-settings-v1');
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    tick(0);

    fixture.componentInstance.setLearningLanguage('en');
    fixture.componentInstance.toggleTheme();

    expect(JSON.parse(window.localStorage.getItem('wortzeit-settings-v1') ?? '{}')).toEqual({
      learningLanguage: 'en',
      theme: 'dark',
    });

    const restoredFixture = TestBed.createComponent(LearningPageComponent);
    restoredFixture.detectChanges();
    tick(0);
    expect(restoredFixture.componentInstance.learningLanguage).toBe('en');
    expect(restoredFixture.componentInstance.theme).toBe('dark');
    window.localStorage.removeItem('wortzeit-settings-v1');
    window.localStorage.removeItem('deutsch-kompass-settings-v1');
  }));

  it('keeps German and English learning progress in separate local storage records', fakeAsync(() => {
    window.localStorage.removeItem('wortzeit-settings-v1');
    window.localStorage.removeItem('wortzeit-progress-de-v1');
    window.localStorage.removeItem('wortzeit-progress-en-v1');
    window.localStorage.removeItem('deutsch-kompass-progress-v1');

    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    tick(0);
    const app = fixture.componentInstance;

    app.markLearned(vocabulary[0]);
    expect(app.learnedCount).toBe(1);
    app.setLearningLanguage('en');
    expect(app.learnedCount).toBe(0);
    app.markLearned(vocabulary[1]);
    expect(app.learnedCount).toBe(1);

    expect(JSON.parse(window.localStorage.getItem('wortzeit-progress-de-v1') ?? '{}').learned).toEqual([vocabulary[0].id]);
    expect(JSON.parse(window.localStorage.getItem('wortzeit-progress-en-v1') ?? '{}').learned).toEqual([vocabulary[1].id]);

    app.setLearningLanguage('de');
    expect(app.learnedCount).toBe(1);
    app.setLearningLanguage('en');
    expect(app.learnedCount).toBe(1);

    window.localStorage.removeItem('wortzeit-settings-v1');
    window.localStorage.removeItem('wortzeit-progress-de-v1');
    window.localStorage.removeItem('wortzeit-progress-en-v1');
  }));

  it('migrates the previous language selection and theme without mixing in German progress', fakeAsync(() => {
    window.localStorage.removeItem('wortzeit-settings-v1');
    window.localStorage.removeItem('wortzeit-progress-de-v1');
    window.localStorage.setItem('deutsch-kompass-settings-v1', JSON.stringify({
      translationLanguage: 'en',
      theme: 'dark',
    }));
    window.localStorage.setItem('deutsch-kompass-progress-v1', JSON.stringify({
      learned: [vocabulary[0].id],
      favorites: [],
      dailyProgress: {},
    }));

    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    tick(0);

    expect(fixture.componentInstance.learningLanguage).toBe('en');
    expect(fixture.componentInstance.theme).toBe('dark');
    expect(fixture.componentInstance.learnedCount).toBe(0);
    expect(window.localStorage.getItem('deutsch-kompass-progress-v1')).not.toBeNull();
    fixture.componentInstance.setLearningLanguage('de');
    expect(fixture.componentInstance.learnedCount).toBe(1);
    expect(window.localStorage.getItem('wortzeit-progress-de-v1')).not.toBeNull();

    window.localStorage.removeItem('wortzeit-settings-v1');
    window.localStorage.removeItem('wortzeit-progress-de-v1');
    window.localStorage.removeItem('deutsch-kompass-settings-v1');
    window.localStorage.removeItem('deutsch-kompass-progress-v1');
  }));

  it('tracks learned words and daily progress', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    const app = fixture.componentInstance;

    app.markLearned(vocabulary[0]);

    expect(app.learnedCount).toBe(1);
    expect(app.todayCount).toBe(1);
    expect(app.progressPercent).toBe(1);
  });

  it('moves to the next sequential card after learning the current word', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;
    app.currentWord = vocabulary[10];
    app.wordIndex = 10;

    app.markLearned(vocabulary[10]);

    expect(app.currentWord).toEqual(vocabulary[11]);
    expect(app.wordIndex).toBe(11);
  });

  it('keeps the active card when learning a different word from the library', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;
    app.currentWord = vocabulary[10];
    app.wordIndex = 10;

    app.markLearned(vocabulary[20]);

    expect(app.currentWord).toEqual(vocabulary[10]);
    expect(app.wordIndex).toBe(10);
  });

  it('celebrates the daily goal once when the fifth distinct word is learned', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    const app = fixture.componentInstance;
    app.theme = 'dark';

    vocabulary.slice(0, app.dailyGoal - 1).forEach((word) => app.markLearned(word));
    expect(app.showDailyGoalCelebration).toBeFalse();

    app.markLearned(vocabulary[app.dailyGoal - 1]);
    fixture.detectChanges();

    expect(app.todayCount).toBe(app.dailyGoal);
    expect(app.showDailyGoalCelebration).toBeTrue();
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.textContent).toContain('План-мінімум виконано');
    expect(dialog.closest('.goal-celebration-backdrop')?.classList.contains('theme-dark')).toBeTrue();
    expect(getComputedStyle(dialog).backgroundColor).toBe('rgb(36, 47, 39)');
    expect(getComputedStyle(dialog.querySelector('h2') as HTMLElement).color).toBe('rgb(241, 245, 239)');
    expect(getComputedStyle(dialog.querySelector('.goal-message') as HTMLElement).color).toBe('rgb(208, 219, 209)');
    expect(getComputedStyle(dialog.querySelector('.goal-continue') as HTMLElement).backgroundColor).toBe('rgb(139, 198, 152)');
    expect(fixture.nativeElement.querySelector('.goal-bear')?.textContent).toContain('🐻');

    const continueButton = fixture.nativeElement.querySelector('.goal-continue') as HTMLButtonElement;
    continueButton.click();
    fixture.detectChanges();
    expect(app.showDailyGoalCelebration).toBeFalse();

    app.markLearned(vocabulary[app.dailyGoal]);
    expect(app.showDailyGoalCelebration).toBeFalse();
  });

  it('shows daily vocabulary counts and words in the selected calendar date', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;
    app.calendarMonth = new Date(2026, 9, 1);
    app.dailyProgress = {
      '2026-10-01': [vocabulary[0].id],
      '2026-10-02': [vocabulary[0].id, vocabulary[1].id, vocabulary[2].id],
      '2026-10-03': vocabulary.slice(0, 5).map((word) => word.id),
    };

    const lowActivity = app.calendarDays.find((day) => day?.key === '2026-10-01');
    const mediumActivity = app.calendarDays.find((day) => day?.key === '2026-10-02');
    const highActivity = app.calendarDays.find((day) => day?.key === '2026-10-03');
    expect(lowActivity?.intensity).toBe('low');
    expect(mediumActivity?.intensity).toBe('medium');
    expect(highActivity?.intensity).toBe('high');

    app.selectCalendarDay(mediumActivity!);
    expect(app.selectedDateKey).toBe('2026-10-02');
    expect(app.selectedDayCount).toBe(3);
    expect(app.selectedDayCountLabel).toBe('3 слова');
    expect(app.selectedDayWords).toEqual(vocabulary.slice(0, 3));
    expect(app.calendarMonthWordCount).toBe(9);
    expect(app.calendarMonthWordCountLabel).toBe('9 слів');
    expect(app.calendarMonthActiveDays).toBe(3);
    expect(app.calendarMonthActiveDaysLabel).toBe('3 дні навчання');
  });

  it('navigates the language diary by month and does not select future dates', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayKey = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-');
    app.calendarMonth = currentMonth;
    app.selectedDateKey = todayKey;

    app.changeCalendarMonth(-1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthKey = [
      previousMonth.getFullYear(),
      String(previousMonth.getMonth() + 1).padStart(2, '0'),
      '01',
    ].join('-');
    expect(app.calendarMonth).toEqual(previousMonth);
    expect(app.selectedDateKey).toBe(previousMonthKey);

    app.changeCalendarMonth(1);
    expect(app.calendarMonth).toEqual(currentMonth);
    const currentMonthKey = [
      currentMonth.getFullYear(),
      String(currentMonth.getMonth() + 1).padStart(2, '0'),
      '01',
    ].join('-');
    expect(app.selectedDateKey).toBe(currentMonthKey);
    expect(app.canGoToNextCalendarMonth).toBeFalse();

    app.calendarMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    app.selectedDateKey = todayKey;
    const futureDay = app.calendarDays.find((day) => day?.isFuture);
    expect(futureDay).toBeDefined();
    app.selectCalendarDay(futureDay!);
    expect(app.selectedDateKey).toBe(todayKey);
  });

  it('moves through vocabulary cards in both directions', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;

    app.showNextWord();
    expect(app.currentWord).toEqual(vocabulary[1]);
    app.showPreviousWord();
    expect(app.currentWord).toEqual(vocabulary[0]);
    app.showPreviousWord();
    expect(app.currentWord).toEqual(vocabulary[vocabulary.length - 1]);
  });

  it('animates card changes when moving through words', fakeAsync(() => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    const slide = fixture.nativeElement.querySelector('.word-slide') as HTMLElement;
    const animation = jasmine.createSpyObj<Animation>('animation', ['cancel']);
    spyOn(slide, 'animate').and.returnValue(animation);

    fixture.componentInstance.showNextWord();
    fixture.detectChanges();
    tick(16);
    expect(slide.querySelector('h3')?.textContent).toContain(vocabulary[1].word);
    expect(fixture.nativeElement.querySelectorAll('.word-slide-outgoing').length).toBe(0);
    expect(slide.animate).toHaveBeenCalledWith(
      [
        { opacity: 0.72 },
        { opacity: 1 },
      ],
      { duration: 180, easing: 'ease-out' },
    );
    (slide.animate as jasmine.Spy).calls.reset();

    fixture.componentInstance.showPreviousWord();
    fixture.detectChanges();
    tick(16);
    expect(slide.animate).toHaveBeenCalledWith(
      [
        { opacity: 0.72 },
        { opacity: 1 },
      ],
      { duration: 180, easing: 'ease-out' },
    );
  }));

  it('starts a lesson with the next unlearned word and clears library filters', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    const app = fixture.componentInstance;

    app.selectTab('texts');
    app.activeCategory = app.categories[1];
    app.searchQuery = 'nonexistent';
    app.learned.add(vocabulary[0].id);
    app.startLearning();

    expect(app.activeTab).toBe('words');
    expect(app.activeCategory).toBe('Усі слова');
    expect(app.searchQuery).toBe('');
    expect(app.currentWord).toEqual(vocabulary[1]);
    expect(app.wordIndex).toBe(1);
    expect(app.showAnswer).toBeFalse();
    expect(app.feedback).toBe('');
  });

  it('starts learning from the main button, including the lesson scroll target', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const learningSection = document.getElementById('learning');
    const scrollSpy = learningSection ? spyOn(learningSection, 'scrollIntoView') : undefined;

    compiled.querySelector<HTMLButtonElement>('.hero-button')?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.activeTab).toBe('words');
    expect(fixture.componentInstance.currentWord).toEqual(vocabulary[0]);
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('shows a completion message when starting after all words are learned', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;
    app.learned = new Set(vocabulary.map((word) => word.id));
    app.activeTab = 'texts';
    app.startLearning();

    expect(app.activeTab).toBe('words');
    expect(app.currentWord).toEqual(vocabulary[0]);
    expect(app.nextWord).toBeUndefined();
    expect(app.feedback).toContain('вивчив(-ла) весь словник');
  });

  it('handles answer, learned, navigation and feedback dismissal buttons', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelector<HTMLButtonElement>('.outline-button')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.showAnswer).toBeTrue();
    expect(compiled.querySelector('.word-hint')?.textContent).toContain(vocabulary[0].translation);

    compiled.querySelector<HTMLButtonElement>('.daily-actions .outline-button')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.showAnswer).toBeFalse();

    compiled.querySelector<HTMLButtonElement>('.outline-button')?.click();
    fixture.detectChanges();
    compiled.querySelector<HTMLButtonElement>('.daily-actions .primary-button')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.learnedCount).toBe(1);
    expect(fixture.componentInstance.todayCount).toBe(1);
    expect(fixture.componentInstance.currentWord).toEqual(vocabulary[1]);
    expect(compiled.querySelector('.feedback-banner')).not.toBeNull();

    compiled.querySelector<HTMLButtonElement>('.feedback-banner button')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.feedback).toBe('');

    compiled.querySelector<HTMLButtonElement>('[aria-label="Наступне слово"]')?.click();
    expect(fixture.componentInstance.currentWord).toEqual(vocabulary[2]);
    compiled.querySelector<HTMLButtonElement>('[aria-label="Попереднє слово"]')?.click();
    expect(fixture.componentInstance.currentWord).toEqual(vocabulary[1]);
  });

  it('handles tabs, search, categories, favorites and library learned buttons', () => {
    const fixture = TestBed.createComponent(LearningPageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    compiled.querySelectorAll<HTMLButtonElement>('.tab-list button')[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab).toBe('phrases');
    expect(compiled.querySelectorAll('.phrase-card').length).toBe(phrases.length);

    compiled.querySelector<HTMLButtonElement>('.phrase-practice')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.feedback).toContain(phrases[0].german);

    compiled.querySelectorAll<HTMLButtonElement>('.tab-list button')[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeTab).toBe('texts');
    expect(compiled.querySelectorAll('.reading-card').length).toBe(readingTexts.length);

    compiled.querySelector<HTMLButtonElement>('.reading-toggle')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.openText).toBe(0);
    expect(compiled.querySelector('.reading-content')).not.toBeNull();

    const translationSummary = compiled.querySelector<HTMLElement>('.translation-details summary');
    expect(translationSummary).not.toBeNull();
    translationSummary!.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.translation-details')?.hasAttribute('open')).toBeTrue();

    const answerSummary = compiled.querySelector<HTMLElement>('.comprehension details summary');
    expect(answerSummary).not.toBeNull();
    answerSummary!.click();
    fixture.detectChanges();
    expect(compiled.querySelector('.comprehension details')?.hasAttribute('open')).toBeTrue();

    compiled.querySelector<HTMLButtonElement>('.reading-done')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.feedback).toContain(readingTexts[0].title);

    compiled.querySelector<HTMLButtonElement>('.reading-toggle')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.openText).toBe(-1);
    expect(compiled.querySelector('.reading-content')).toBeNull();

    compiled.querySelectorAll<HTMLButtonElement>('.tab-list button')[0].click();
    fixture.detectChanges();
    const search = compiled.querySelector<HTMLInputElement>('.search-box input');
    expect(search).not.toBeNull();
    search!.value = vocabulary[0].word;
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.visibleWords.map((word) => word.id)).toEqual([vocabulary[0].id]);

    search!.value = '';
    search!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    compiled.querySelectorAll<HTMLButtonElement>('.category-list button')[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeCategory).toBe(fixture.componentInstance.categories[1]);

    const firstFavorite = compiled.querySelector<HTMLButtonElement>('.favorite-button');
    expect(firstFavorite).not.toBeNull();
    firstFavorite!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.isFavorite(vocabulary[0])).toBeTrue();
    firstFavorite!.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.isFavorite(vocabulary[0])).toBeFalse();

    compiled.querySelector<HTMLButtonElement>('.learned-button')?.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.isLearned(vocabulary[0])).toBeTrue();
  });

  it('preserves the daily count and avoids duplicate progress for an already learned word', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;
    app.markLearned(vocabulary[0]);
    const learnedCount = app.learnedCount;
    const todayCount = app.todayCount;

    app.markLearned(vocabulary[0]);

    expect(app.learnedCount).toBe(learnedCount);
    expect(app.todayCount).toBe(todayCount);
    expect(app.feedback).toContain('вже позначено');
  });

  it('uses Ukrainian categories and phrases', () => {
    const app = TestBed.createComponent(LearningPageComponent).componentInstance;

    expect(app.categories[0]).toBe('Усі слова');
    expect(app.categories).toContain('Дім і побут');
    expect(phrases[0].translation).toBe('Доброго ранку!');
  });

  it('includes exactly 1000 unique vocabulary entries with complete study examples', () => {
    expect(vocabulary.length).toBe(1000);
    expect(new Set(vocabulary.map((word) => word.word)).size).toBe(1000);
    expect(new Set(vocabulary.map((word) => word.translationEnglish)).size).toBe(1000);
    expect(new Set(vocabulary.map((word) => word.id)).size).toBe(1000);
    expect(vocabulary.every((word) =>
      word.translation && word.translationEnglish && word.category && word.phrase && word.example,
    )).toBeTrue();
    expect(vocabulary[0].translationEnglish).toBe('the apartment');
    expect(vocabulary.some((word) => word.category === 'Одяг і покупки')).toBeTrue();
    expect(vocabulary.some((word) => word.category === 'Природа й довкілля')).toBeTrue();
  });

  it('keeps vocabulary translations and categories in Ukrainian', () => {
    expect(
      vocabulary
        .filter((word) => /[ыэёъ]/iu.test(`${word.translation} ${word.category}`))
        .map((word) => `${word.word}: ${word.translation} (${word.category})`),
    ).toEqual([]);
  });

  it('includes practice phrases and reading texts', () => {
    expect(phrases.length).toBeGreaterThan(0);
    expect(readingTexts.length).toBe(8);
    expect(readingTexts.every((text) => text.questions.length > 0)).toBeTrue();
  });
});
