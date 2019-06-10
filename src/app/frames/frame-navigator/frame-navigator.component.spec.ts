import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameNavigatorComponent } from './frame-navigator.component';

describe('FrameNavigatorComponent', () => {
  let component: FrameNavigatorComponent;
  let fixture: ComponentFixture<FrameNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
