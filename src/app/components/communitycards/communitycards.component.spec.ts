import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitycardsComponent } from './communitycards.component';

describe('CommunitycardsComponent', () => {
  let component: CommunitycardsComponent;
  let fixture: ComponentFixture<CommunitycardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunitycardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitycardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
