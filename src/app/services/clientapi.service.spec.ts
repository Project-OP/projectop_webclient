import { TestBed } from '@angular/core/testing';

import { ClientapiService } from './clientapi.service';

describe('ClientapiService', () => {
  let service: ClientapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
