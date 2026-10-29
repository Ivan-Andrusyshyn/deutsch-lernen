import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { WordCard } from '../../../core/models/vocabulary.model';

@Component({
  selector: 'app-vocabulary-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vocabulary-card.component.html',
  styleUrl: './vocabulary-card.component.css',
})
export class VocabularyCardComponent {
  @Input({ required: true }) word!: WordCard;
  @Input({ required: true }) language!: 'de' | 'en';
  @Input({ required: true }) displayWord!: string;
  @Input() favorite = false;
  @Input() learned = false;

  @Output() favoriteToggled = new EventEmitter<WordCard>();
  @Output() learnedToggled = new EventEmitter<WordCard>();
}
