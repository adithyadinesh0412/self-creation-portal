import { TestBed } from '@angular/core/testing';

import { LibProgramService } from './lib-program.service';

describe('LibProgramService', () => {
  let service: LibProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
