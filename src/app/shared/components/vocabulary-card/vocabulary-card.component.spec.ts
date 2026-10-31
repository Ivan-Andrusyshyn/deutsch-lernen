import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import type { WordCard } from '../../../core/models/vocabulary.model';
import { PixabayImageService } from '../../../core/services/pixabay-image.service';
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
      providers: [{
        provide: PixabayImageService,
        useValue: { findImage: () => of(null) },
      }],
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

  it('shows an offline-safe illustration and labels it accessibly', () => {
    const illustration = (fixture.nativeElement as HTMLElement).querySelector('.vocab-image-fallback');
    expect(illustration?.getAttribute('role')).toBe('img');
    expect(illustration?.getAttribute('aria-label')).toBe('das Haus — будинок');
    expect(illustration?.textContent).toContain('🏠');
    expect(fixture.componentInstance.imageIllustration).toBe('🏠');
  });

  it('chooses a matching illustration for the word in either study language', () => {
    fixture.componentRef.setInput('word', { ...word, translationEnglish: 'the dog', translation: 'собака' });
    fixture.componentRef.setInput('displayWord', 'der Hund');
    fixture.detectChanges();

    expect(fixture.componentInstance.imageIllustration).toBe('🐕');
    expect(fixture.nativeElement.querySelector('.vocab-image-fallback')?.getAttribute('aria-label')).toBe('der Hund — собака');

    fixture.componentRef.setInput('word', { ...word, translationEnglish: 'computer mouse', translation: 'комп’ютерна миша' });
    fixture.componentRef.setInput('displayWord', 'die Maus');
    fixture.detectChanges();

    expect(fixture.componentInstance.imageIllustration).toBe('🖱️');
  });

  it('falls back to the matching illustration when a Pixabay image fails to load', () => {
    fixture.componentInstance.image = {
      url: 'https://cdn.pixabay.com/photo/example.jpg',
      pageUrl: 'https://pixabay.com/photos/example/',
      tags: 'house, home',
    };
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.vocab-image img') as HTMLImageElement).dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.componentInstance.image).toBeNull();
    expect(fixture.componentInstance.imageFailed).toBeTrue();
    expect(fixture.nativeElement.querySelector('.vocab-image-fallback')?.textContent).toContain('Фото тимчасово недоступне');
    expect(fixture.nativeElement.querySelector('.vocab-image-fallback span')?.textContent).toBe('🏠');
  });
});
