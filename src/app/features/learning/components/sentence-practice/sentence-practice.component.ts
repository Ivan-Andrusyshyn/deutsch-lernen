import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import type { LearningLanguage, LearningLevel } from '../../../../core/models/vocabulary.model';
import { quizQuestionsFor, sentencesFor, type SentenceExercise, type SentenceQuizQuestion } from '../../data/sentence-exercises';

@Component({
  selector: 'app-sentence-practice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sentence-practice.component.html',
  styleUrl: './sentence-practice.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SentencePracticeComponent implements OnChanges {
  @Input() mode: 'cards' | 'quiz' = 'cards';
  @Input({ required: true }) language: LearningLanguage = 'de';
  @Input({ required: true }) level: LearningLevel = 'A2';

  index = 0;
  showTranslation = false;
  selectedAnswer: string | null = null;
  private previousLanguage: LearningLanguage = 'de';
  private previousLevel: LearningLevel = 'A2';
  private cachedQuizKey = '';
  private cachedQuizQuestions: SentenceQuizQuestion[] = [];

  get sentences(): SentenceExercise[] {
    return sentencesFor(this.language, this.level);
  }

  get currentSentence(): SentenceExercise | undefined {
    return this.sentences[this.mode === 'quiz' ? Math.floor(this.index / 4) : this.index];
  }

  get quizQuestions() {
    const key = `${this.language}-${this.level}`;
    if (key !== this.cachedQuizKey) {
      this.cachedQuizKey = key;
      this.cachedQuizQuestions = quizQuestionsFor(this.language, this.level);
    }
    return this.cachedQuizQuestions;
  }

  get quizQuestion(): SentenceQuizQuestion | undefined {
    return this.quizQuestions[this.index];
  }

  get totalItems(): number {
    return this.mode === 'quiz' ? this.quizQuestions.length : this.sentences.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['language'] && this.language !== this.previousLanguage) ||
      (changes['level'] && this.level !== this.previousLevel)
    ) {
      this.index = 0;
      this.showTranslation = false;
      this.selectedAnswer = null;
    }
    if (changes['mode']) {
      this.index = 0;
      this.showTranslation = false;
      this.selectedAnswer = null;
    }
    this.previousLanguage = this.language;
    this.previousLevel = this.level;
  }

  toggleTranslation(): void {
    this.showTranslation = !this.showTranslation;
  }

  previous(): void {
    if (this.index === 0) return;
    this.index -= 1;
    this.showTranslation = false;
    this.selectedAnswer = null;
  }

  next(): void {
    if (this.index >= this.totalItems - 1) return;
    this.index += 1;
    this.showTranslation = false;
    this.selectedAnswer = null;
  }

  chooseAnswer(answer: string): void {
    if (this.selectedAnswer !== null) return;
    this.selectedAnswer = answer;
  }

  get answerIsCorrect(): boolean {
    return this.selectedAnswer === this.quizQuestion?.answer;
  }
}
