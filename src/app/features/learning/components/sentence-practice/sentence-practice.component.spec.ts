import { ComponentFixture, TestBed } from '@angular/core/testing';
import { quizQuestionsFor, sentencesFor } from '../../data/sentence-exercises';
import { SentencePracticeComponent } from './sentence-practice.component';

describe('SentencePracticeComponent', () => {
  let fixture: ComponentFixture<SentencePracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SentencePracticeComponent] }).compileComponents();
    fixture = TestBed.createComponent(SentencePracticeComponent);
    fixture.detectChanges();
  });

  it('provides 50 translated sentence exercises for each language and level', () => {
    for (const language of ['de', 'en'] as const) {
      for (const level of ['A2', 'B1'] as const) {
        const sentences = sentencesFor(language, level);
        expect(sentences.length).toBe(50);
        expect(new Set(sentences.map((sentence) => sentence.id)).size).toBe(50);
        expect(sentences.every((sentence) => sentence.text.trim() && sentence.translation.trim())).toBeTrue();
      }
    }
  });

  it('provides 200 varied quiz questions with four valid options for every language and level', () => {
    for (const language of ['de', 'en'] as const) {
      for (const level of ['A2', 'B1'] as const) {
        const questions = quizQuestionsFor(language, level);
        expect(questions.length).toBe(200);
        expect(new Set(questions.map((question) => question.id)).size).toBe(200);
        expect(new Set(questions.map((question) => question.kind))).toEqual(
          new Set(['translate', 'reverse', 'gap', 'gap-second']),
        );
        expect(questions.every((question) => question.prompt.trim() && question.answer.trim() &&
          question.options.length === 4 && question.options.includes(question.answer) &&
          new Set(question.options).size === 4)).toBeTrue();
      }
    }
  });

  it('shows 200 quiz questions and requires an answer before advancing', () => {
    const component = fixture.componentInstance;
    component.mode = 'quiz';
    component.ngOnChanges({ mode: {
      previousValue: 'cards', currentValue: 'quiz', firstChange: false,
      isFirstChange: () => false,
    } });
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(component.totalItems).toBe(200);
    expect(element.querySelector('.sentence-counter')?.textContent).toContain('із 200');
    const next = element.querySelector('[aria-label="Наступне питання"]') as HTMLButtonElement;
    expect(next.disabled).toBeTrue();
    (element.querySelector('.quiz-option') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(next.disabled).toBeFalse();
    next.click();
    fixture.detectChanges();
    expect(component.index).toBe(1);
  });

  it('reveals translations and moves between sentences without recording learning progress', () => {
    const component = fixture.componentInstance;
    const element = fixture.nativeElement as HTMLElement;
    const currentText = component.currentSentence?.text;

    expect(element.querySelector('.sentence-answer')).toBeNull();
    (element.querySelector('.sentence-reveal') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(element.querySelector('.sentence-answer p')?.textContent?.trim()).toBe(
      component.currentSentence?.translation,
    );

    (element.querySelector('[aria-label="Наступне речення"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(component.index).toBe(1);
    expect(component.currentSentence?.text).not.toBe(currentText);
    expect(component.showTranslation).toBeFalse();
  });

  it('resets the exercise when language or level changes', () => {
    const component = fixture.componentInstance;
    component.index = 8;
    component.showTranslation = true;
    component.level = 'B1';
    component.ngOnChanges({ level: {
      previousValue: 'A2', currentValue: 'B1', firstChange: false,
      isFirstChange: () => false,
    } });
    expect(component.index).toBe(0);
    expect(component.showTranslation).toBeFalse();
    expect(component.sentences.length).toBe(50);
  });
});
