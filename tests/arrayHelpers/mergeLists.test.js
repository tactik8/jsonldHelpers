
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('mergeLists', () => {
    const records1 = [
        { '@type': 'Person', '@id': '123', name: 'John' },
        { '@type': 'Person', '@id': '456', name: 'Jane' }
    ];

    const records2 = [
        { '@type': 'Person', '@id': '789', name: 'Bob' },
        { '@type': 'Thing', '@id': '999', title: 'Sample' }
    ];

    test('should merge two arrays without duplicates', () => {
        const result = arrayHelpers.merge(records1, records2);
        
        expect(result).toHaveLength(4);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
        expect(result).toContainEqual({ '@type': 'Person', '@id': '456', name: 'Jane' });
        expect(result).toContainEqual({ '@type': 'Person', '@id': '789', name: 'Bob' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '999', title: 'Sample' });
    });

    test('should handle overlapping records without mergeIfExist', () => {
        const records2WithOverlap = [
            { '@type': 'Person', '@id': '123', age: 30 }, // overlaps with records1[0]
            { '@type': 'Thing', '@id': '999', title: 'Sample' }
        ];
        const result = arrayHelpers.merge(records1, records2WithOverlap, false);
        
        expect(result).toHaveLength(3);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' }); // original should remain
        expect(result).toContainEqual({ '@type': 'Person', '@id': '456', name: 'Jane' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '999', title: 'Sample' });
    });

    test('should merge overlapping records when mergeIfExist is true', () => {
        const records2WithOverlap = [
            { '@type': 'Person', '@id': '123', age: 30 }, // overlaps with records1[0]
            { '@type': 'Thing', '@id': '999', title: 'Sample' }
        ];
        const result = arrayHelpers.merge(records1, records2WithOverlap, true);
        
        expect(result).toHaveLength(3);
        // Should contain merged record (assuming mergeRecords works correctly)
        const mergedRecord = result.find(r => r['@id'] === '123');
        expect(mergedRecord).toBeDefined();
        expect(mergedRecord['@type']).toBe('Person');
        expect(mergedRecord['@id']).toBe('123');
    });

    test('should handle single record instead of arrays', () => {
        const singleRecord1 = { '@type': 'Person', '@id': '123', name: 'John' };
        const singleRecord2 = { '@type': 'Person', '@id': '456', name: 'Jane' };
        const result = arrayHelpers.merge(singleRecord1, singleRecord2);
        
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(singleRecord1);
        expect(result).toContainEqual(singleRecord2);
    });

    test('should handle empty arrays', () => {
        expect(arrayHelpers.merge([], records2)).toEqual(records2);
        expect(arrayHelpers.merge(records1, [])).toEqual(records1);
        expect(arrayHelpers.merge([], [])).toEqual([]);
    });

    test('should handle null and undefined inputs', () => {
        const result1 = arrayHelpers.merge(null, records2);
        expect(result1).toEqual(records2);
        
        const result2 = arrayHelpers.merge(records1, null);
        expect(result2).toEqual(records1);
        
        const result3 = arrayHelpers.merge(undefined, records2);
        expect(result3).toEqual(records2);
        
        const result4 = arrayHelpers.merge(records1, undefined);
        expect(result4).toEqual(records1);
    });

    test('should handle invalid JSON-LD objects', () => {
        const invalidRecords1 = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { name: 'Invalid1' } // invalid JSON-LD
        ];
        const invalidRecords2 = [
            { name: 'Invalid2' }, // invalid JSON-LD
            { '@type': 'Thing', '@id': '999', title: 'Sample' }
        ];
        const result = arrayHelpers.merge(invalidRecords1, invalidRecords2);
        
        // Valid records should be merged properly
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
        expect(result).toContainEqual({ '@type': 'Thing', '@id': '999', title: 'Sample' });
        // Invalid records should remain unchanged
        expect(result).toContainEqual({ name: 'Invalid1' });
        expect(result).toContainEqual({ name: 'Invalid2' });
    });

    test('should handle identical arrays', () => {
        const result = arrayHelpers.merge(records1, records1);
        
        expect(result).toEqual(records1); // No duplicates should be added
    });

    test('should preserve order when merging', () => {
        const result = arrayHelpers.merge(records1, records2);
        
        // First array records should come first
        expect(result.indexOf(records1[0])).toBeLessThan(result.indexOf(records2[0]));
        expect(result.indexOf(records1[1])).toBeLessThan(result.indexOf(records2[0]));
    });

    test('should handle primitive values mixed with objects', () => {
        const mixedRecords1 = [
            ...records1,
            'primitive1',
            123
        ];
        const mixedRecords2 = [
            ...records2,
            'primitive2',
            456
        ];
        const result = arrayHelpers.merge(mixedRecords1, mixedRecords2);
        
        expect(result.length).toBe(8); // 2 + 2 + 2 + 2
        expect(result).toContain('primitive1');
        expect(result).toContain('primitive2');
        expect(result).toContain(123);
        expect(result).toContain(456);
    });
});
