import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesManagerComponent } from './frames-manager.component';

describe('FramesManagerComponent', () => {
  let component: FramesManagerComponent;
  let fixture: ComponentFixture<FramesManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramesManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
