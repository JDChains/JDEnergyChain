import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentprofileComponent } from './residentprofile.component';

describe('ResidentprofileComponent', () => {
  let component: ResidentprofileComponent;
  let fixture: ComponentFixture<ResidentprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidentprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
