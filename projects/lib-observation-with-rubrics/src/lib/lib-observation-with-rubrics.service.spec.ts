import { TestBed } from '@angular/core/testing';

import { LibObservationWithRubricsService } from './lib-observation-with-rubrics.service';

describe('LibObservationWithRubricsService', () => {
  let service: LibObservationWithRubricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibObservationWithRubricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
