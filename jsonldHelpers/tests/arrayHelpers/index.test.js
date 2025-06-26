
// Main test suite for arrayHelpers
// This file imports and runs all individual function tests

import './getRecord.test.js';
import './setRecord.test.js';
import './deleteRecord.test.js';
import './addRecord.test.js';
import './filter.test.js';
import './contains.test.js';
import './sortRecords.test.js';
import './getUniqueRefs.test.js';
import './deduplicate.test.js';
import './diffLists.test.js';
import './concat.test.js';

describe('arrayHelpers', () => {
  test('should export all expected functions', () => {
    const { arrayHelpers } = require('../../src/arrayHelpers.js');
    
    expect(arrayHelpers).toBeDefined();
    expect(typeof arrayHelpers.get).toBe('function');
    expect(typeof arrayHelpers.set).toBe('function');
    expect(typeof arrayHelpers.delete).toBe('function');
    expect(typeof arrayHelpers.add).toBe('function');
    expect(typeof arrayHelpers.filter).toBe('function');
    expect(typeof arrayHelpers.sort).toBe('function');
    expect(typeof arrayHelpers.getUniqueRefs).toBe('function');
    expect(typeof arrayHelpers.deduplicate).toBe('function');
    expect(typeof arrayHelpers.diff).toBe('function');
    expect(typeof arrayHelpers.concat).toBe('function');
    expect(typeof arrayHelpers.contains).toBe('function');
  });
});
