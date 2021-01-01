import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnactionsComponent } from './turnactions.component';

describe('TurnactionsComponent', () => {
  let component: TurnactionsComponent;
  let fixture: ComponentFixture<TurnactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TurnactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
