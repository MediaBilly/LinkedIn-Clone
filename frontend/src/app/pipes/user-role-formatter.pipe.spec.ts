import { UserRoleFormatterPipe } from './user-role-formatter.pipe';

describe('UserRoleFormatterPipe', () => {
  it('create an instance', () => {
    const pipe = new UserRoleFormatterPipe();
    expect(pipe).toBeTruthy();
  });
});
