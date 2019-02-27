import { TestBed, inject } from '@angular/core/testing';

import { ResidentprofileService } from './residentprofile.service';

describe('ResidentprofileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResidentprofileService]
    });
  });

  it('should be created', inject([ResidentprofileService], (service: ResidentprofileService) => {
    expect(service).toBeTruthy();
  }));
});
