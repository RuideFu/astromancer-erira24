import { TestBed } from '@angular/core/testing';

import { CurveDataService } from './curve-data.service';

describe('CurveService', () => {
  let service: CurveDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
