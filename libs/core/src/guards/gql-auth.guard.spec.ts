import { GqlAuthGuard } from './gql-auth.guard';

describe('GqlAuthGuard', () => {
  it('should be defined', () => {
    expect(new GqlAuthGuard()).toBeDefined();
  });
});
