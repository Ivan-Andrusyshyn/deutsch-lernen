import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WordPaginationComponent } from './word-pagination.component';

describe('WordPaginationComponent', () => {
  let fixture: ComponentFixture<WordPaginationComponent>;
  let component: WordPaginationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [WordPaginationComponent] }).compileComponents();
    fixture = TestBed.createComponent(WordPaginationComponent);
    component = fixture.componentInstance;
    component.totalItems = 41;
    fixture.detectChanges();
  });

  it('shows the item range, page window, and 10/20 page-size choices', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.word-range')?.textContent).toContain('1–10 з 41');
    expect(Array.from(element.querySelectorAll('nav button:not(.page-navigation)')).map((button) => button.textContent?.trim()))
      .toEqual(['1', '2', '3']);
    expect(element.querySelectorAll('select option').length).toBe(2);
  });

  it('emits bounded page changes and page-size changes', () => {
    const pageChange = jasmine.createSpy('pageChange');
    const sizeChange = jasmine.createSpy('sizeChange');
    component.pageChange.subscribe(pageChange);
    component.pageSizeChange.subscribe(sizeChange);

    component.selectPage(99);
    component.selectPage(0);
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = '20';
    select.dispatchEvent(new Event('change'));

    expect(pageChange).toHaveBeenCalledWith(5);
    expect(pageChange).toHaveBeenCalledWith(1);
    expect(sizeChange).toHaveBeenCalledWith(20);
  });
});
