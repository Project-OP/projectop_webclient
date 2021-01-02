import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerbuttonComponent } from './dealerbutton.component';

describe('DealerbuttonComponent', () => {
  let component: DealerbuttonComponent;
  let fixture: ComponentFixture<DealerbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealerbuttonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
