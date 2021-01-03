import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionissuesComponent } from './connectionissues.component';

describe('ConnectionissuesComponent', () => {
  let component: ConnectionissuesComponent;
  let fixture: ComponentFixture<ConnectionissuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectionissuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
