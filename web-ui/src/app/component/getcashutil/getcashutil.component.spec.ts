import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetcashutilComponent } from './getcashutil.component';

describe('GetcashutilComponent', () => {
  let component: GetcashutilComponent;
  let fixture: ComponentFixture<GetcashutilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetcashutilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetcashutilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
