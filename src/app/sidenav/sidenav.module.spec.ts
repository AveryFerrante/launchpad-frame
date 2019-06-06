import { SidenavModule } from './sidenav.module';

describe('NotificationsModule', () => {
  let sidenanModule: SidenavModule;

  beforeEach(() => {
    sidenanModule = new SidenavModule();
  });

  it('should create an instance', () => {
    expect(sidenanModule).toBeTruthy();
  });
});
