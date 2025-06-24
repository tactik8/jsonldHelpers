
import { objectHelpers } from '../../src/src/objectHelpers.js';

describe('meetsFilterParams', () => {
    const validRecord = { '@type': 'Person', '@id': '123', name: 'John', age: 30 };

    test('should return true for valid record with matching filter', () => {
        const filterParams = { name: 'John' };
        const result = objectHelpers.test(validRecord, filterParams);
        
        expect(result).toBe(true);
    });

    test('should return false for valid record with non-matching filter', () => {
        const filterParams = { name: 'Jane' };
        const result = objectHelpers.test(validRecord, filterParams);
        
        expect(result).toBe(false);
    });

    test('should return false for invalid JSON-LD object', () => {
        const invalidRecord = { name: 'John' }; // missing @type and @id
        const filterParams = { name: 'John' };
        const result = objectHelpers.test(invalidRecord, filterParams);
        
        expect(result).toBe(false);
    });

    test('should return true for undefined filter params', () => {
        const result = objectHelpers.test(validRecord, undefined);
        expect(result).toBe(true);
    });

    test('should return true for null filter params', () => {
        const result = objectHelpers.test(validRecord, null);
        expect(result).toBe(true);
    });

    test('should handle multiple filter parameters', () => {
        const filterParams = { name: 'John', age: 30 };
        const result = objectHelpers.test(validRecord, filterParams);
        
        expect(result).toBe(true);
    });

    test('should fail if any filter parameter does not match', () => {
        const filterParams = { name: 'John', age: 25 };
        const result = objectHelpers.test(validRecord, filterParams);
        
        expect(result).toBe(false);
    });

    test('should handle negative filter parameters', () => {
        const filterParams = { name: 'John' };
        const negativeFilterParams = { age: 25 };
        const result = objectHelpers.test(validRecord, filterParams, negativeFilterParams);
        
        expect(result).toBe(true);
    });

    test('should fail if negative filter parameter matches', () => {
        const filterParams = { name: 'John' };
        const negativeFilterParams = { age: 30 };
        const result = objectHelpers.test(validRecord, filterParams, negativeFilterParams);
        
        expect(result).toBe(false);
    });

    test('should handle strict mode for exact matching', () => {
        const record = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };
        const filterParams = { tags: ['red', 'blue'] };
        const result = objectHelpers.test(record, filterParams, {}, true);
        
        expect(result).toBe(true);
    });

    test('should handle non-strict mode for subset matching', () => {
        const record = { '@type': 'Person', '@id': '123', tags: ['red', 'blue', 'green'] };
        const filterParams = { tags: 'red' };
        const result = objectHelpers.test(record, filterParams, {}, false);
        
        expect(result).toBe(true);
    });

    test('should handle empty filter params object', () => {
        const result = objectHelpers.test(validRecord, {});
        expect(result).toBe(true);
    });
});
