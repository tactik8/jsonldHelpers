
import { testData } from '../testData.js';

export function testIsValid(runner, h) {
    const testName = 'objectHelpers.isValid';
    
    // Test valid objects
    runner.assert(h.isValid(testData.validRecords.person), 'Should return true for valid person', testName);
    runner.assert(h.isValid(testData.validRecords.organization), 'Should return true for valid organization', testName);
    runner.assert(h.isValid(testData.validRecords.nestedRecord), 'Should return true for nested record', testName);
    
    // Test invalid objects
    runner.assert(!h.isValid(testData.invalidRecords.noType), 'Should return false for object without @type', testName);
    runner.assert(!h.isValid(testData.invalidRecords.emptyObject), 'Should return false for empty object', testName);
    runner.assert(!h.isValid(testData.invalidRecords.nullValue), 'Should return false for null', testName);
    runner.assert(!h.isValid(testData.invalidRecords.undefinedValue), 'Should return false for undefined', testName);
    runner.assert(!h.isValid(testData.invalidRecords.stringValue), 'Should return false for string', testName);
    runner.assert(!h.isValid(testData.invalidRecords.numberValue), 'Should return false for number', testName);
    runner.assert(!h.isValid(testData.invalidRecords.arrayValue), 'Should return false for array', testName);
    
    // Test edge cases
    const onlyType = { '@type': 'Thing' };
    runner.assert(h.isValid(onlyType), 'Should return true for object with only @type', testName);
    
    const typeAndId = { '@type': 'Thing', '@id': 'test-id' };
    runner.assert(h.isValid(typeAndId), 'Should return true for object with @type and @id', testName);
    
    const nullType = { '@type': null };
    runner.assert(!h.isValid(nullType), 'Should return false for null @type', testName);
    
    const emptyType = { '@type': '' };
    runner.assert(!h.isValid(emptyType), 'Should return false for empty @type', testName);
}
