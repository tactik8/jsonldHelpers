
import { testData } from '../testData.js';

export function testIsSame(runner, h) {
    const testName = 'objectHelpers.isSame';
    
    // Test with same objects
    runner.assert(h.isSame(testData.validRecords.person, testData.validRecords.person), 'Should return true for same object', testName);
    
    // Test with objects having same @type and @id
    const person1 = { '@type': 'Person', '@id': 'test-id', 'name': 'John' };
    const person2 = { '@type': 'Person', '@id': 'test-id', 'age': 30 };
    runner.assert(h.isSame(person1, person2), 'Should return true for same @type and @id', testName);
    
    // Test with different @type
    const person = { '@type': 'Person', '@id': 'test-id' };
    const org = { '@type': 'Organization', '@id': 'test-id' };
    runner.assert(!h.isSame(person, org), 'Should return false for different @type', testName);
    
    // Test with different @id
    const person3 = { '@type': 'Person', '@id': 'id-1' };
    const person4 = { '@type': 'Person', '@id': 'id-2' };
    runner.assert(!h.isSame(person3, person4), 'Should return false for different @id', testName);
    
    // Test with non-JSON-LD objects
    runner.assert(h.isSame('test', 'test'), 'Should return true for same strings', testName);
    runner.assert(!h.isSame('test1', 'test2'), 'Should return false for different strings', testName);
    runner.assert(h.isSame(42, 42), 'Should return true for same numbers', testName);
    runner.assert(!h.isSame(42, 43), 'Should return false for different numbers', testName);
    
    // Test with null/undefined
    runner.assert(h.isSame(null, null), 'Should return true for null values', testName);
    runner.assert(h.isSame(undefined, undefined), 'Should return true for undefined values', testName);
    runner.assert(!h.isSame(null, undefined), 'Should return false for null vs undefined', testName);
    
    // Test with arrays
    const arr1 = [person1, person2];
    const arr2 = [person1, person2];
    runner.assert(h.isSame(arr1, arr2), 'Should return true for same arrays', testName);
    
    const arr3 = [person1];
    const arr4 = [person1, person2];
    runner.assert(!h.isSame(arr3, arr4), 'Should return false for arrays of different length', testName);
    
    // Test edge cases
    const missingType = { '@id': 'test-id' };
    const missingId = { '@type': 'Person' };
    runner.assert(!h.isSame(missingType, missingId), 'Should return false for invalid objects', testName);
}
