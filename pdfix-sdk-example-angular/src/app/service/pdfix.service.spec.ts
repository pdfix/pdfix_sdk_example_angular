import { TestBed } from '@angular/core/testing';

import { PdfixService } from './pdfix.service';

describe('PdfixService', () => {
  let service: PdfixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
