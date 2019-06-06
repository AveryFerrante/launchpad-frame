import { SidenavModule } from './sidenav.module';

describe('NotificationsModule', () => {
  let notificationsModule: SidenavModule;

  beforeEach(() => {
    notificationsModule = new SidenavModule();
  });

  it('should create an instance', () => {
    expect(notificationsModule).toBeTruthy();
  });
});
