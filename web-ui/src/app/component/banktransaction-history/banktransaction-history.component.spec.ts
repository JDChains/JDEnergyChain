import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanktransactionHistoryComponent } from './banktransaction-history.component';

describe('BanktransactionHistoryComponent', () => {
  let component: BanktransactionHistoryComponent;
  let fixture: ComponentFixture<BanktransactionHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanktransactionHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanktransactionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
