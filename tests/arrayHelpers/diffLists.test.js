
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('diffLists', () => {
    const records1 = [
        { '@type': 'Person', '@id': '123', name: 'John' },
        { '@type': 'Person', '@id': '456', name: 'Jane' },
        { '@type': 'Thing', '@id': '789', title: 'Sample' }
    ];

    const records2 = [
        { '@type': 'Person', '@id': '123', name: 'John Updated' }, // same reference as records1[0]
        { '@type': 'Thing', '@id': '999', title: 'Different' }
    ];

    test('should return records in first list not present in second', () => {
        const result = arrayHelpers.diff(records1, records2);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '456', name: 'Jane' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '789', title: 'Sample' });
        expect(result).not.toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
    });

    test('should return empty array when all records are present', () => {
        const sameRecords = [
            { '@type': 'Person', '@id': '123', name: 'John Different' }, // same ref as records1[0]
            { '@type': 'Person', '@id': '456', name: 'Jane Different' }, // same ref as records1[1]
            { '@type': 'Thing', '@id': '789', title: 'Sample Different' } // same ref as records1[2]
        ];
        const result = arrayHelpers.diff(records1, sameRecords);
        
        expect(result).toEqual([]);
    });

    test('should return all records when second list is empty', () => {
        const result = arrayHelpers.diff(records1, []);
        
        expect(result).toEqual(records1);
    });

    test('should handle single record instead of arrays', () => {
        const singleRecord1 = { '@type': 'Person', '@id': '123', name: 'John' };
        const singleRecord2 = { '@type': 'Person', '@id': '456', name: 'Jane' };
        const result = arrayHelpers.diff(singleRecord1, singleRecord2);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(singleRecord1);
    });

    test('should handle identical single records', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John' };
        const identicalRecord = { '@type': 'Person', '@id': '123', name: 'John Different' };
        const result = arrayHelpers.diff(singleRecord, identicalRecord);
        
        expect(result).toEqual([]);
    });

    test('should handle null and undefined inputs', () => {
        expect(arrayHelpers.diff(null, records2)).toEqual([]);
        expect(arrayHelpers.diff(records1, null)).toEqual(records1);
        expect(arrayHelpers.diff(undefined, records2)).toEqual([]);
        expect(arrayHelpers.diff(records1, undefined)).toEqual(records1);
    });

    test('should handle mixed valid and invalid JSON-LD objects', () => {
        const mixedRecords1 = [
            ...records1,
            { name: 'Invalid1' }, // invalid JSON-LD
            'primitive1'
        ];
        const mixedRecords2 = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { name: 'Invalid2' }
        ];
        const result = arrayHelpers.diff(mixedRecords1, mixedRecords2);
        
        // Should return records from mixedRecords1 not present in mixedRecords2
        expect(result.length).toBeGreaterThan(0);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '456', name: 'Jane' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '789', title: 'Sample' });
    });

    test('should handle empty arrays', () => {
        const result = arrayHelpers.diff([], []);
        expect(result).toEqual([]);
    });

    test('should handle records with same id but different types', () => {
        const list1 = [{ '@type': 'Person', '@id': '123', name: 'John' }];
        const list2 = [{ '@type': 'Thing', '@id': '123', title: 'Sample' }];
        const result = arrayHelpers.diff(list1, list2);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
    });
});
