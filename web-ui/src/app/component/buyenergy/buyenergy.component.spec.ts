import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyenergyComponent } from './buyenergy.component';

describe('BuyenergyComponent', () => {
  let component: BuyenergyComponent;
  let fixture: ComponentFixture<BuyenergyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyenergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyenergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
