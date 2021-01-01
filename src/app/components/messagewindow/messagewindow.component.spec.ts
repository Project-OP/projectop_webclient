import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagewindowComponent } from './messagewindow.component';

describe('MessagewindowComponent', () => {
  let component: MessagewindowComponent;
  let fixture: ComponentFixture<MessagewindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagewindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagewindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
