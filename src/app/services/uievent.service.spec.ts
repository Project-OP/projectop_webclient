import { TestBed } from '@angular/core/testing';

import { UieventService } from './uievent.service';

describe('UieventService', () => {
  let service: UieventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UieventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
