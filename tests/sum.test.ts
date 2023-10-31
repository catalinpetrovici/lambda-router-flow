import { sum } from '../index';

describe('sum test', () => {
  it('should test sum', () => {
    expect(sum(2, 2)).toBe(4);
  });
});
