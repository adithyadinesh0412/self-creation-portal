import { TestBed } from '@angular/core/testing';

import { LibObservationService } from './lib-observation.service';

describe('LibObservationService', () => {
  let service: LibObservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibObservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
