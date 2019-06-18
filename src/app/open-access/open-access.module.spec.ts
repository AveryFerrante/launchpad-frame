import { OpenAccessModule } from './open-access.module';

describe('OpenAccessModule', () => {
  let openAccessModule: OpenAccessModule;

  beforeEach(() => {
    openAccessModule = new OpenAccessModule();
  });

  it('should create an instance', () => {
    expect(openAccessModule).toBeTruthy();
  });
});
