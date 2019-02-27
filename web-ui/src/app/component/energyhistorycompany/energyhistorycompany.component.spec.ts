import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyhistorycompanyComponent } from './energyhistorycompany.component';

describe('EnergyhistorycompanyComponent', () => {
  let component: EnergyhistorycompanyComponent;
  let fixture: ComponentFixture<EnergyhistorycompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyhistorycompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyhistorycompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
