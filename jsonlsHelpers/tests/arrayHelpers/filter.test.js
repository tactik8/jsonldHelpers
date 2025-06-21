
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('filter', () => {
    const records = [
        { '@type': 'Person', '@id': '123', name: 'John', age: 30, city: 'NYC' },
        { '@type': 'Person', '@id': '456', name: 'Jane', age: 25, city: 'LA' },
        { '@type': 'Thing', '@id': '789', title: 'Sample', category: 'test' },
        { '@type': 'Person', '@id': '101', name: 'Bob', age: 30, city: 'NYC' }
    ];

    test('should filter by single property', () => {
        const filterParams = { age: 30 };
        const result = arrayHelpers.filter(records, filterParams);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(records[0]);
        expect(result).toContainEqual(records[3]);
    });

    test('should filter by multiple properties', () => {
        const filterParams = { age: 30, city: 'NYC' };
        const result = arrayHelpers.filter(records, filterParams);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(records[0]);
        expect(result).toContainEqual(records[3]);
    });

    test('should filter by type', () => {
        const filterParams = { '@type': 'Thing' };
        const result = arrayHelpers.filter(records, filterParams);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(records[2]);
    });

    test('should return empty array when no matches', () => {
        const filterParams = { age: 999 };
        const result = arrayHelpers.filter(records, filterParams);
        
        expect(result).toEqual([]);
    });

    test('should return all records with undefined filter params', () => {
        const result = arrayHelpers.filter(records, undefined);
        expect(result).toEqual(records);
    });

    test('should return all records with null filter params', () => {
        const result = arrayHelpers.filter(records, null);
        expect(result).toEqual(records);
    });

    test('should handle negative filter params', () => {
        const filterParams = undefined;
        const negativeFilterParams = { age: 30 };
        const result = arrayHelpers.filter(records, filterParams, negativeFilterParams);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(records[1]); // Jane, age 25
        expect(result).toContainEqual(records[2]); // Thing
    });

    test('should handle strict mode', () => {
        const filterParams = { name: 'John' };
        const result = arrayHelpers.filter(records, filterParams, undefined, true);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(records[0]);
    });

    test('should handle single record instead of array', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John', age: 30 };
        const filterParams = { age: 30 };
        const result = arrayHelpers.filter(singleRecord, filterParams);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(singleRecord);
    });

    test('should handle empty records array', () => {
        const filterParams = { age: 30 };
        const result = arrayHelpers.filter([], filterParams);
        
        expect(result).toEqual([]);
    });

    test('should filter out invalid JSON-LD objects', () => {
        const mixedRecords = [
            ...records,
            { name: 'Invalid' }, // missing @type and @id
            { '@type': 'Person' } // missing @id
        ];
        const filterParams = { name: 'John' };
        const result = arrayHelpers.filter(mixedRecords, filterParams);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(records[0]);
    });
});
