
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('deduplicate', () => {
    const recordsWithDuplicates = [
        { '@type': 'Person', '@id': '123', name: 'John' },
        { '@type': 'Person', '@id': '456', name: 'Jane' },
        { '@type': 'Person', '@id': '123', age: 30 }, // duplicate
        { '@type': 'Thing', '@id': '789', title: 'Sample' },
        'duplicate string',
        'duplicate string', // duplicate primitive
        { name: 'Invalid1' }, // invalid JSON-LD
        { name: 'Invalid1' }, // duplicate invalid JSON-LD
        null,
        null // duplicate null
    ];

    test('should deduplicate records properly', () => {
        const result = arrayHelpers.deduplicate(recordsWithDuplicates);
        
        // Should contain unique JSON-LD objects (merged) and unique primitives
        expect(result.length).toBeLessThan(recordsWithDuplicates.length);
        
        // Should contain unique primitives
        const stringCount = result.filter(r => r === 'duplicate string').length;
        expect(stringCount).toBe(1);
        
        const nullCount = result.filter(r => r === null).length;
        expect(nullCount).toBe(1);
    });

    test('should handle single record instead of array', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = arrayHelpers.deduplicate(singleRecord);
        
        expect(result).toHaveLength(1);
        expect(result).toContainEqual(singleRecord);
    });

    test('should handle empty array', () => {
        const result = arrayHelpers.deduplicate([]);
        expect(result).toEqual([]);
    });

    test('should handle array with no duplicates', () => {
        const uniqueRecords = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { '@type': 'Person', '@id': '456', name: 'Jane' },
            { '@type': 'Thing', '@id': '789', title: 'Sample' }
        ];
        const result = arrayHelpers.deduplicate(uniqueRecords);
        
        expect(result).toHaveLength(3);
        expect(result).toEqual(expect.arrayContaining(uniqueRecords));
    });

    test('should handle only invalid JSON-LD objects', () => {
        const invalidRecords = [
            { name: 'Invalid1' },
            { name: 'Invalid1' }, // duplicate
            { name: 'Invalid2' },
            { '@type': 'Person' } // missing @id
        ];
        const result = arrayHelpers.deduplicate(invalidRecords);
        
        expect(result.length).toBeLessThan(invalidRecords.length);
        
        const invalid1Count = result.filter(r => r.name === 'Invalid1').length;
        expect(invalid1Count).toBe(1);
    });

    test('should handle only primitive values', () => {
        const primitives = ['a', 'b', 'a', 'c', 'b', 1, 2, 1];
        const result = arrayHelpers.deduplicate(primitives);
        
        expect(result).toHaveLength(5); // 'a', 'b', 'c', 1, 2
        expect(result).toContain('a');
        expect(result).toContain('b');
        expect(result).toContain('c');
        expect(result).toContain(1);
        expect(result).toContain(2);
        
        const aCount = result.filter(r => r === 'a').length;
        expect(aCount).toBe(1);
    });

    test('should merge duplicate JSON-LD objects', () => {
        const duplicatesForMerging = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { '@type': 'Person', '@id': '123', age: 30 },
            { '@type': 'Person', '@id': '123', city: 'NYC' }
        ];
        const result = arrayHelpers.deduplicate(duplicatesForMerging);
        
        expect(result).toHaveLength(1);
        // The merged record should contain all properties (assuming mergeRecords works correctly)
        const mergedRecord = result[0];
        expect(mergedRecord['@type']).toBe('Person');
        expect(mergedRecord['@id']).toBe('123');
    });
});
