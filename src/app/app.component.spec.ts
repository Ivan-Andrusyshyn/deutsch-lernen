import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { phrases, readingTexts, vocabulary } from './vocabulary';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('renders the Ukrainian learning app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('залишається');
    expect(compiled.querySelector('.total-pill')?.textContent).toContain('500 слів');
  });

  it('tracks learned words and daily progress', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    app.markLearned(vocabulary[0]);

    expect(app.learnedCount).toBe(1);
    expect(app.todayCount).toBe(1);
    expect(app.progressPercent).toBe(1);
  });

  it('moves through vocabulary cards in both directions', () => {
    const app = TestBed.createComponent(AppComponent).componentInstance;

    app.showNextWord();
    expect(app.currentWord).toEqual(vocabulary[1]);
    app.showPreviousWord();
    expect(app.currentWord).toEqual(vocabulary[0]);
    app.showPreviousWord();
    expect(app.currentWord).toEqual(vocabulary[vocabulary.length - 1]);
  });

  it('animates card changes when moving through words', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
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
    const fixture = TestBed.createComponent(AppComponent);
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
    const fixture = TestBed.createComponent(AppComponent);
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
    const app = TestBed.createComponent(AppComponent).componentInstance;
    app.learned = new Set(vocabulary.map((word) => word.id));
    app.activeTab = 'texts';
    app.startLearning();

    expect(app.activeTab).toBe('words');
    expect(app.currentWord).toEqual(vocabulary[0]);
    expect(app.nextWord).toBeUndefined();
    expect(app.feedback).toContain('вивчив(-ла) весь словник');
  });

  it('handles answer, learned, navigation and feedback dismissal buttons', () => {
    const fixture = TestBed.createComponent(AppComponent);
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
    const fixture = TestBed.createComponent(AppComponent);
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
    const app = TestBed.createComponent(AppComponent).componentInstance;
    app.markLearned(vocabulary[0]);
    const learnedCount = app.learnedCount;
    const todayCount = app.todayCount;

    app.markLearned(vocabulary[0]);

    expect(app.learnedCount).toBe(learnedCount);
    expect(app.todayCount).toBe(todayCount);
    expect(app.feedback).toContain('вже позначено');
  });

  it('uses Ukrainian categories and phrases', () => {
    const app = TestBed.createComponent(AppComponent).componentInstance;

    expect(app.categories[0]).toBe('Усі слова');
    expect(app.categories).toContain('Дім і побут');
    expect(phrases[0].translation).toBe('Доброго ранку!');
  });

  it('includes exactly 500 unique A2 vocabulary entries with complete study examples', () => {
    expect(vocabulary.length).toBe(500);
    expect(new Set(vocabulary.map((word) => word.word)).size).toBe(500);
    expect(new Set(vocabulary.map((word) => word.id)).size).toBe(500);
    expect(vocabulary.every((word) => word.translation && word.category && word.phrase && word.example)).toBeTrue();
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
