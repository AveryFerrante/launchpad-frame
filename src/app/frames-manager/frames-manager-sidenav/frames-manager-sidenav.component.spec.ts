import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FramesManagerSidenavComponent } from './frames-manager-sidenav.component';

describe('FramesManagerSidenavComponent', () => {
  let component: FramesManagerSidenavComponent;
  let fixture: ComponentFixture<FramesManagerSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FramesManagerSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FramesManagerSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
