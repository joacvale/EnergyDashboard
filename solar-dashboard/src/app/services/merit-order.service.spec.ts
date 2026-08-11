import { TestBed } from '@angular/core/testing';

import { MeritOrderService } from './merit-order.service';

describe('MeritOrderService', () => {
  let service: MeritOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeritOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
