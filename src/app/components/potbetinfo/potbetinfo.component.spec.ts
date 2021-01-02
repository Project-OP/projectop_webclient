import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotbetinfoComponent } from './potbetinfo.component';

describe('PotbetinfoComponent', () => {
  let component: PotbetinfoComponent;
  let fixture: ComponentFixture<PotbetinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotbetinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PotbetinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
