import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankregComponent } from './bankreg.component';

describe('BankregComponent', () => {
  let component: BankregComponent;
  let fixture: ComponentFixture<BankregComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankregComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankregComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
