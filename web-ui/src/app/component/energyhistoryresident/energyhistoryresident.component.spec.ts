import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyhistoryresidentComponent } from './energyhistoryresident.component';

describe('EnergyhistoryresidentComponent', () => {
  let component: EnergyhistoryresidentComponent;
  let fixture: ComponentFixture<EnergyhistoryresidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyhistoryresidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyhistoryresidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
