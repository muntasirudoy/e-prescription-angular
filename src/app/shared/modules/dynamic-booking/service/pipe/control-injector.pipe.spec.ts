import { ControlInjector } from './control-injector.pipe';

describe('ControlInjectorPipe', () => {
  it('create an instance', () => {
    const pipe = new ControlInjector();
    expect(pipe).toBeTruthy();
  });
});
