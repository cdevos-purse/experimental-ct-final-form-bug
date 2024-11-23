import {describe, expect, it} from 'vitest';
import {CommonFormatters} from './formatters';

describe(`expiryToServer`, () => {
  ([
    ['03/30', '2030-03-01'],
    ['03/2030', '2030-03-01'],
    ['-03/30', '-03/30'],
    ['', ''],
    [null, null],
  ]).forEach(([date, result]) => {
    it(`should transform "${date}" to "${result}"`, async () => {
      expect(CommonFormatters.expiryToServer(date)).toBe(result);
    });
  });
});

describe(`expiryToServer`, () => {
  ([
    ['3/', '03/'],
    ['03', '03/'],
    ['03//', '03/'],
    ['0330', '03/30'],
    ['1q230', '12/30'],
    ['9999', '9999'],
    ['abc', ''],
    [null, null],
  ]).forEach(([date, result]) => {
    it(`should transform "${date}" to "${result}"`, async () => {
      expect(CommonFormatters.expiry(date )).toBe(result);
    });
  });
});
