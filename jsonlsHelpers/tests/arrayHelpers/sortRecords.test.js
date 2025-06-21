
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('sortRecords', () => {
    const records = [
        { '@type': 'Person', '@id': 'c', name: 'Charlie' },
        { '@type': 'Person', '@id': 'a', name: 'Alice' },
        { '@type': 'Thing', '@id': 'b', name: 'Bob' },
        { '@type': 'Person', '@id': 'b', name: 'Bob' }
    ];

    test('should sort records in ascending order by default', () => {
        const result = arrayHelpers.sort(records);
        
        // Should be sorted by @type first, then @id
        expect(result[0]).toEqual({ '@type': 'Person', '@id': 'a', name: 'Alice' });
        expect(result[1]).toEqual({ '@type': 'Person', '@id': 'b', name: 'Bob' });
        expect(result[2]).toEqual({ '@type': 'Person', '@id': 'c', name: 'Charlie' });
        expect(result[3]).toEqual({ '@type': 'Thing', '@id': 'b', name: 'Bob' });
    });

    test('should sort records in descending order when reverse is true', () => {
        const result = arrayHelpers.sort(records, true);
        
        // Should be sorted in reverse order
        expect(result[0]).toEqual({ '@type': 'Thing', '@id': 'b', name: 'Bob' });
        expect(result[1]).toEqual({ '@type': 'Person', '@id': 'c', name: 'Charlie' });
        expect(result[2]).toEqual({ '@type': 'Person', '@id': 'b', name: 'Bob' });
        expect(result[3]).toEqual({ '@type': 'Person', '@id': 'a', name: 'Alice' });
    });

    test('should handle single record instead of array', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = arrayHelpers.sort(singleRecord);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(singleRecord);
    });

    test('should handle empty array', () => {
        const result = arrayHelpers.sort([]);
        expect(result).toEqual([]);
    });

    test('should handle array with one element', () => {
        const singleRecord = [{ '@type': 'Person', '@id': '123', name: 'John' }];
        const result = arrayHelpers.sort(singleRecord);
        
        expect(result).toEqual(singleRecord);
    });

    test('should handle records with same type and id', () => {
        const duplicateRecords = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { '@type': 'Person', '@id': '123', age: 30 }
        ];
        const result = arrayHelpers.sort(duplicateRecords);
        
        expect(result).toHaveLength(2);
        // Both should be considered equal in sorting
    });

    test('should handle mixed valid and invalid JSON-LD objects', () => {
        const mixedRecords = [
            { '@type': 'Person', '@id': 'b', name: 'Bob' },
            { name: 'Invalid' }, // invalid JSON-LD
            { '@type': 'Person', '@id': 'a', name: 'Alice' }
        ];
        const result = arrayHelpers.sort(mixedRecords);
        
        expect(result).toHaveLength(3);
        // Valid JSON-LD objects should be sorted properly
    });
});
