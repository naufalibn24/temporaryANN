import { TestBed } from '@angular/core/testing';

import { HeadchiefService } from './headchief.service';

describe('HeadchiefService', () => {
  let service: HeadchiefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeadchiefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
