import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergySellComponent } from './energy-sell.component';

describe('EnergySellComponent', () => {
  let component: EnergySellComponent;
  let fixture: ComponentFixture<EnergySellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergySellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergySellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
