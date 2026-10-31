import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vocabulary } from '../../data/vocabulary';
import { LearningCalendarComponent } from './learning-calendar.component';

describe('LearningCalendarComponent', () => {
  let fixture: ComponentFixture<LearningCalendarComponent>;
  let component: LearningCalendarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LearningCalendarComponent] }).compileComponents();
    fixture = TestBed.createComponent(LearningCalendarComponent);
    component = fixture.componentInstance;
    component.words = vocabulary;
  });

  it('displays the words learned on a selected calendar day', () => {
    component.calendarMonth = new Date(2020, 9, 1);
    component.dailyProgress = {
      '2020-10-02': [vocabulary[0].id, vocabulary[1].id],
    };
    fixture.detectChanges();

    const dayButton = Array.from(fixture.nativeElement.querySelectorAll('.diary-day') as NodeListOf<HTMLButtonElement>)
      .find((button) => button.querySelector('.diary-day-number')?.textContent?.trim() === '2');
    dayButton?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.diary-word-list li').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.diary-word-list')?.textContent).toContain(vocabulary[0].word);
  });

  it('navigates months and disables future days', () => {
    const now = new Date();
    component.calendarMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.diary-month-nav button') as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    fixture.detectChanges();
    expect(component.calendarMonth).toEqual(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    buttons[1].click();
    fixture.detectChanges();
    expect(component.calendarMonth).toEqual(new Date(now.getFullYear(), now.getMonth(), 1));
    expect(buttons[1].disabled).toBeTrue();

    component.calendarMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    fixture.detectChanges();
    expect(Array.from(fixture.nativeElement.querySelectorAll('.diary-day') as NodeListOf<HTMLButtonElement>)
      .some((button) => button.disabled)).toBeTrue();
  });
});
