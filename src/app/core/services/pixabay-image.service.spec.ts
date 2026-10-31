import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PixabayImageService } from './pixabay-image.service';

describe('PixabayImageService', () => {
  let service: PixabayImageService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PixabayImageService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PixabayImageService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('searches through the same-origin proxy and removes English articles', () => {
    const expectedImage = {
      url: 'https://cdn.pixabay.com/photo/example.jpg',
      pageUrl: 'https://pixabay.com/photos/example/',
      tags: 'house, home',
    };
    service.findImage('the house').subscribe((image) => expect(image).toEqual(expectedImage));

    const request = httpTestingController.expectOne(
      (candidate) => candidate.url === '/api/images' && candidate.params.get('q') === 'house',
    );
    expect(request.request.method).toBe('GET');
    request.flush({ image: expectedImage });
  });

  it('reuses an in-flight or cached search for the same term', () => {
    const firstResult = jasmine.createSpy('firstResult');
    const secondResult = jasmine.createSpy('secondResult');
    service.findImage('dog').subscribe(firstResult);
    service.findImage('dog').subscribe(secondResult);

    const request = httpTestingController.expectOne('/api/images?q=dog');
    request.flush({ image: null });

    expect(firstResult).toHaveBeenCalledOnceWith(null);
    expect(secondResult).toHaveBeenCalledOnceWith(null);
  });
});
