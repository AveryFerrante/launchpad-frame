import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesManagerCreateComponent } from './frames-manager-create.component';

describe('FramesManagerCreateComponent', () => {
  let component: FramesManagerCreateComponent;
  let fixture: ComponentFixture<FramesManagerCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramesManagerCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramesManagerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
