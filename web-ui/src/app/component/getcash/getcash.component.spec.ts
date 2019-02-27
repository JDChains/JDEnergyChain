import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetcashComponent } from './getcash.component';

describe('GetcashComponent', () => {
  let component: GetcashComponent;
  let fixture: ComponentFixture<GetcashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetcashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetcashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
