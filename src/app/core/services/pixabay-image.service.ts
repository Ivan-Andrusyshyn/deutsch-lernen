import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, shareReplay } from 'rxjs';

export interface VocabularyImage {
  url: string;
  pageUrl: string;
  tags: string;
}

interface ImageSearchResponse {
  image: VocabularyImage | null;
}

@Injectable({ providedIn: 'root' })
export class PixabayImageService {
  private readonly cache = new Map<string, Observable<VocabularyImage | null>>();

  constructor(private readonly http: HttpClient) {}

  findImage(term: string): Observable<VocabularyImage | null> {
    const query = term
      .replace(/^(the|a|an)\s+/i, '')
      .toLocaleLowerCase('en')
      .trim();

    if (!query) {
      return of(null);
    }

    const cached = this.cache.get(query);
    if (cached) {
      return cached;
    }

    const params = new HttpParams().set('q', query);
    const request = this.http
      .get<ImageSearchResponse>('/api/images', { params })
      .pipe(
        map((response) => response.image),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    this.cache.set(query, request);

    return request;
  }
}
