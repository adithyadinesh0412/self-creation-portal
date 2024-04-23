import { TestBed } from '@angular/core/testing';

import { LibSharedModulesService } from './lib-shared-modules.service';

describe('LibSharedModulesService', () => {
  let service: LibSharedModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibSharedModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
