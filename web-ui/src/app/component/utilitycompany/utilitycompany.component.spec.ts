import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilitycompanyComponent } from './utilitycompany.component';

describe('UtilitycompanyComponent', () => {
  let component: UtilitycompanyComponent;
  let fixture: ComponentFixture<UtilitycompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilitycompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilitycompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
