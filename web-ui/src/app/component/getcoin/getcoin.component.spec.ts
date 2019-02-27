import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetcoinComponent } from './getcoin.component';

describe('GetcoinComponent', () => {
  let component: GetcoinComponent;
  let fixture: ComponentFixture<GetcoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetcoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
