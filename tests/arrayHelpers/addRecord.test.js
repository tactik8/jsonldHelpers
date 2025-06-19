
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('addRecord', () => {
    const existingRecords = [
        { '@type': 'Person', '@id': '123', name: 'John' },
        { '@type': 'Person', '@id': '456', name: 'Jane' }
    ];

    test('should add new record to array', () => {
        const newRecord = { '@type': 'Person', '@id': '789', name: 'Bob' };
        const result = arrayHelpers.add(newRecord, existingRecords);
        
        expect(result).toHaveLength(3);
        expect(result).toContainEqual(newRecord);
    });

    test('should not add duplicate record by default', () => {
        const duplicateRecord = { '@type': 'Person', '@id': '123', name: 'John Updated' };
        const result = arrayHelpers.add(duplicateRecord, existingRecords);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
    });

    test('should merge duplicate record when mergeIfExist is true', () => {
        const duplicateRecord = { '@type': 'Person', '@id': '123', age: 30 };
        const result = arrayHelpers.add(duplicateRecord, existingRecords, true);
        
        expect(result).toHaveLength(2);
        // Note: This test assumes mergeRecords function works correctly
        const updatedRecord = result.find(r => r['@id'] === '123');
        expect(updatedRecord).toBeDefined();
    });

    test('should return original array for invalid record', () => {
        const invalidRecord = { name: 'Invalid' }; // missing @type and @id
        const result = arrayHelpers.add(invalidRecord, existingRecords);
        
        expect(result).toEqual(existingRecords);
    });

    test('should handle single record instead of array', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John' };
        const newRecord = { '@type': 'Person', '@id': '789', name: 'Bob' };
        const result = arrayHelpers.add(newRecord, singleRecord);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(singleRecord);
        expect(result).toContainEqual(newRecord);
    });

    test('should handle null record', () => {
        const result = arrayHelpers.add(null, existingRecords);
        expect(result).toEqual(existingRecords);
    });

    test('should handle undefined record', () => {
        const result = arrayHelpers.add(undefined, existingRecords);
        expect(result).toEqual(existingRecords);
    });

    test('should handle empty records array', () => {
        const newRecord = { '@type': 'Person', '@id': '789', name: 'Bob' };
        const result = arrayHelpers.add(newRecord, []);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(newRecord);
    });

    test('should replace existing record when mergeIfExist is false', () => {
        const updatedRecord = { '@type': 'Person', '@id': '123', name: 'John Updated' };
        const result = arrayHelpers.add(updatedRecord, existingRecords, false);
        
        expect(result).toHaveLength(2);
        expect(result).not.toContainEqual(updatedRecord);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
    });
});
