import { TestBed } from '@angular/core/testing';

import { PingpongService } from './pingpong.service';

describe('PingpongService', () => {
  let service: PingpongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PingpongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
