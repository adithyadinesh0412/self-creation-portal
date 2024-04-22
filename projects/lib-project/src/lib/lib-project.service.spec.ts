import { TestBed } from '@angular/core/testing';

import { LibProjectService } from './lib-project.service';

describe('LibProjectService', () => {
  let service: LibProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
