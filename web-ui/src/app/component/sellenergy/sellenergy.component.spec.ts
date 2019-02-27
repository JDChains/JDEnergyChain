import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellenergyComponent } from './sellenergy.component';

describe('SellenergyComponent', () => {
  let component: SellenergyComponent;
  let fixture: ComponentFixture<SellenergyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellenergyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellenergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
