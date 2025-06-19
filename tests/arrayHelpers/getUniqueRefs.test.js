
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('getUniqueRefs', () => {
    const records = [
        { '@type': 'Person', '@id': '123', name: 'John', age: 30 },
        { '@type': 'Person', '@id': '456', name: 'Jane', age: 25 },
        { '@type': 'Person', '@id': '123', name: 'John Updated', age: 31 }, // duplicate
        { '@type': 'Thing', '@id': '789', title: 'Sample' },
        { name: 'Invalid' } // invalid JSON-LD object
    ];

    test('should return unique references from records', () => {
        const result = arrayHelpers.getUniqueRefs(records);
        
        expect(result).toHaveLength(3);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123' });
        expect(result).toContainEqual({ '@type': 'Person', '@id': '456' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '789' });
    });

    test('should handle single record instead of array', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = arrayHelpers.getUniqueRefs(singleRecord);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123' });
    });

    test('should handle empty array', () => {
        const result = arrayHelpers.getUniqueRefs([]);
        expect(result).toEqual([]);
    });

    test('should filter out invalid JSON-LD objects', () => {
        const invalidRecords = [
            { name: 'Invalid1' },
            { '@type': 'Person' }, // missing @id
            { '@id': '123' } // missing @type
        ];
        const result = arrayHelpers.getUniqueRefs(invalidRecords);
        
        expect(result).toEqual([]);
    });

    test('should handle all duplicate records', () => {
        const duplicateRecords = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { '@type': 'Person', '@id': '123', age: 30 },
            { '@type': 'Person', '@id': '123', city: 'NYC' }
        ];
        const result = arrayHelpers.getUniqueRefs(duplicateRecords);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123' });
    });

    test('should handle records with same id but different types', () => {
        const sameIdRecords = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { '@type': 'Thing', '@id': '123', title: 'Sample' }
        ];
        const result = arrayHelpers.getUniqueRefs(sameIdRecords);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '123' });
    });

    test('should handle null and undefined records', () => {
        const mixedRecords = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            null,
            undefined,
            { '@type': 'Thing', '@id': '456', title: 'Sample' }
        ];
        const result = arrayHelpers.getUniqueRefs(mixedRecords);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '456' });
    });
});
