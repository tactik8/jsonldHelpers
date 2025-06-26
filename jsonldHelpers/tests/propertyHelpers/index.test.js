
// This file imports all property helper tests to ensure they run together
import './getProperties.test.js';
import './getRecordType.test.js';
import './setRecordType.test.js';
import './getRecordId.test.js';
import './setRecordId.test.js';
import './getValue.test.js';
import './getValues.test.js';
import './setValue.test.js';
import './addValue.test.js';
import './deleteValue.test.js';

describe('PropertyHelpers', () => {
  test('All property helper tests are loaded', () => {
    expect(true).toBe(true);
  });
});
