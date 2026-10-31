import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type WordPageSize = 10 | 20;

@Component({
  selector: 'app-word-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './word-pagination.component.html',
})
export class WordPaginationComponent {
  @Input({ required: true }) totalItems = 0;
  @Input({ required: true }) pageSize: WordPageSize = 10;
  @Input({ required: true }) currentPage = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<WordPageSize>();

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get visiblePages(): number[] {
    const firstPage = Math.max(1, Math.min(this.currentPage - 1, this.pageCount - 2));
    const lastPage = Math.min(this.pageCount, firstPage + 2);
    return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index);
  }

  get firstItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get lastItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  selectPage(page: number): void {
    this.pageChange.emit(Math.max(1, Math.min(page, this.pageCount)));
  }

  selectPageSize(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(value === '20' ? 20 : 10);
  }
}
