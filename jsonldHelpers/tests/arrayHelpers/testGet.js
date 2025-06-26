
import { testData, deepCopy } from '../testData.js';

export function testGet(runner, h) {
    const testName = 'arrayHelpers.get';
    
    // Test basic get functionality
    const records = deepCopy(testData.recordArrays.mixed);
    const personRef = { '@type': 'Person', '@id': 'person-1' };
    const found = h.get(personRef, records);
    
    runner.assert(found !== undefined, 'Should find existing record', testName);
    runner.assert(found['@type'] === 'Person', 'Should return correct type', testName);
    runner.assert(found['@id'] === 'person-1', 'Should return correct id', testName);
    runner.assert(found.name === 'John Doe', 'Should return complete record', testName);
    
    // Test with non-existent record
    const nonExistentRef = { '@type': 'Person', '@id': 'non-existent' };
    const notFound = h.get(nonExistentRef, records);
    runner.assert(notFound === undefined, 'Should return undefined for non-existent record', testName);
    
    // Test with invalid ref
    const invalidRef = { name: 'Invalid' };
    const invalidResult = h.get(invalidRef, records);
    runner.assert(invalidResult === undefined, 'Should return undefined for invalid ref', testName);
    
    // Test with single record (not array)
    const singleRecord = testData.validRecords.person;
    const singleRef = { '@type': 'Person', '@id': 'person-1' };
    const singleResult = h.get(singleRef, singleRecord);
    runner.assert(singleResult !== undefined, 'Should work with single record', testName);
    
    // Test with nested processing
    const nestedRecords = [testData.validRecords.nestedRecord];
    const nestedRef = { '@type': 'Article', '@id': 'article-1' };
    const nestedResult = h.get(nestedRef, nestedRecords, true);
    runner.assert(nestedResult !== undefined, 'Should find nested record', testName);
    runner.assert(typeof nestedResult.author === 'object', 'Should process nested objects', testName);
    
    // Test without nested processing
    const noNestedResult = h.get(nestedRef, nestedRecords, false);
    runner.assert(noNestedResult !== undefined, 'Should find record without nesting', testName);
    
    // Test edge cases
    runner.assert(h.get(null, records) === undefined, 'Should handle null ref', testName);
    runner.assert(h.get(undefined, records) === undefined, 'Should handle undefined ref', testName);
    runner.assert(h.get(personRef, []) === undefined, 'Should handle empty array', testName);
    runner.assert(h.get(personRef, null) === undefined, 'Should handle null records', testName);
}
