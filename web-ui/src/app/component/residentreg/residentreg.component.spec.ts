import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentregComponent } from './residentreg.component';

describe('ResidentregComponent', () => {
  let component: ResidentregComponent;
  let fixture: ComponentFixture<ResidentregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidentregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
