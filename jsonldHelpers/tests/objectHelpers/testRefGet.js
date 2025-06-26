
import { testData } from '../testData.js';

export function testRefGet(runner, h) {
    const testName = 'objectHelpers.ref.get';
    
    // Test with valid object
    const ref = h.ref.get(testData.validRecords.person);
    runner.assert(ref['@type'] === 'Person', 'Should return correct @type', testName);
    runner.assert(ref['@id'] === 'person-1', 'Should return correct @id', testName);
    runner.assert(Object.keys(ref).length === 2, 'Should only contain @type and @id', testName);
    
    // Test with array
    const arrayRef = h.ref.get([testData.validRecords.person, testData.validRecords.organization]);
    runner.assert(Array.isArray(arrayRef), 'Should return array for array input', testName);
    runner.assert(arrayRef[0]['@type'] === 'Person', 'Should handle first item correctly', testName);
    runner.assert(arrayRef[1]['@type'] === 'Organization', 'Should handle second item correctly', testName);
    
    // Test with invalid objects
    runner.assert(h.ref.get(testData.invalidRecords.noType) === undefined, 'Should return undefined for object without @type', testName);
    runner.assert(h.ref.get(testData.invalidRecords.nullValue) === undefined, 'Should return undefined for null', testName);
    runner.assert(h.ref.get(testData.invalidRecords.stringValue) === undefined, 'Should return undefined for string', testName);
    
    // Test with object without @id
    const noIdObj = { '@type': 'Thing', 'name': 'Test' };
    runner.assert(h.ref.get(noIdObj) === undefined, 'Should return undefined for object without @id', testName);
    
    // Test edge cases
    const nullId = { '@type': 'Thing', '@id': null };
    runner.assert(h.ref.get(nullId) === undefined, 'Should return undefined for null @id', testName);
    
    const emptyId = { '@type': 'Thing', '@id': '' };
    runner.assert(h.ref.get(emptyId) === undefined, 'Should return undefined for empty @id', testName);
}
