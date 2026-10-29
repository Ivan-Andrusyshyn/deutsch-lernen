import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { WordCard } from '../../../core/models/vocabulary.model';
import { VocabularyCardComponent } from './vocabulary-card.component';

describe('VocabularyCardComponent', () => {
  let fixture: ComponentFixture<VocabularyCardComponent>;
  const word: WordCard = {
    id: 'noun-1',
    word: 'das Haus',
    translation: 'будинок',
    translationEnglish: 'the house',
    category: 'Дім',
    kind: 'noun',
    phrase: 'ein schönes Haus',
    example: 'Das Haus ist groß.',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VocabularyCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(VocabularyCardComponent);
    fixture.componentRef.setInput('word', word);
    fixture.componentRef.setInput('language', 'de');
    fixture.componentRef.setInput('displayWord', word.word);
    fixture.detectChanges();
  });

  it('renders the reusable vocabulary card and emits its actions', () => {
    const favoriteHandler = jasmine.createSpy('favoriteHandler');
    const learnedHandler = jasmine.createSpy('learnedHandler');
    fixture.componentInstance.favoriteToggled.subscribe(favoriteHandler);
    fixture.componentInstance.learnedToggled.subscribe(learnedHandler);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h4')?.textContent?.trim()).toBe('das Haus');
    expect(element.querySelector('.vocab-example')?.textContent).toContain('ein schönes Haus');

    (element.querySelector('.favorite-button') as HTMLButtonElement).click();
    (element.querySelector('.learned-button') as HTMLButtonElement).click();
    expect(favoriteHandler).toHaveBeenCalledWith(word);
    expect(learnedHandler).toHaveBeenCalledWith(word);
  });
});
