import { TestBed } from '@angular/core/testing';

import { LibSurveyService } from './lib-survey.service';

describe('LibSurveyService', () => {
  let service: LibSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibSurveyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
