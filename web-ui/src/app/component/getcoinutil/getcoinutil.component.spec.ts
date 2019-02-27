import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetcoinutilComponent } from './getcoinutil.component';

describe('GetcoinutilComponent', () => {
  let component: GetcoinutilComponent;
  let fixture: ComponentFixture<GetcoinutilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetcoinutilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetcoinutilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
