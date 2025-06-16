import { TestBed } from '@angular/core/testing';

import { ShiftReqService } from './shift-req.service';

describe('ShiftReqService', () => {
  let service: ShiftReqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftReqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
