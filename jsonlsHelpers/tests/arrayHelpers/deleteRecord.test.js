
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('deleteRecord', () => {
    const records = [
        { '@type': 'Person', '@id': '123', name: 'John' },
        { '@type': 'Person', '@id': '456', name: 'Jane' },
        { '@type': 'Thing', '@id': '789', title: 'Sample' }
    ];

    test('should delete existing record', () => {
        const ref = { '@type': 'Person', '@id': '123' };
        const result = arrayHelpers.delete(ref, records);
        
        expect(result).toHaveLength(2);
        expect(result).not.toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
        expect(result).toContainEqual({ '@type': 'Person', '@id': '456', name: 'Jane' });
    });

    test('should return original array if record not found', () => {
        const ref = { '@type': 'Person', '@id': '999' };
        const result = arrayHelpers.delete(ref, records);
        
        expect(result).toHaveLength(3);
        expect(result).toEqual(records);
    });

    test('should return original array for invalid reference', () => {
        const invalidRef = { name: 'John' }; // missing @type and @id
        const result = arrayHelpers.delete(invalidRef, records);
        
        expect(result).toEqual(records);
    });

    test('should handle single record instead of array', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John' };
        const ref = { '@type': 'Person', '@id': '123' };
        const result = arrayHelpers.delete(ref, singleRecord);
        
        expect(result).toEqual([]);
    });

    test('should handle null reference', () => {
        const result = arrayHelpers.delete(null, records);
        expect(result).toEqual(records);
    });

    test('should handle undefined reference', () => {
        const result = arrayHelpers.delete(undefined, records);
        expect(result).toEqual(records);
    });

    test('should handle empty records array', () => {
        const ref = { '@type': 'Person', '@id': '123' };
        const result = arrayHelpers.delete(ref, []);
        
        expect(result).toEqual([]);
    });

    test('should not delete records with same id but different type', () => {
        const ref = { '@type': 'Thing', '@id': '123' };
        const result = arrayHelpers.delete(ref, records);
        
        expect(result).toHaveLength(3);
        expect(result).toContainEqual({ '@type': 'Person', '@id': '123', name: 'John' });
    });
});
