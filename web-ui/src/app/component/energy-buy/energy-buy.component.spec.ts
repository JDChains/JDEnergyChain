import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyBuyComponent } from './energy-buy.component';

describe('EnergyBuyComponent', () => {
  let component: EnergyBuyComponent;
  let fixture: ComponentFixture<EnergyBuyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyBuyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyBuyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
