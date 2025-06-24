
import { arrayHelpers } from '../../src/src/arrayHelpers.js';

describe('getRecord', () => {
    const records = [
        { '@type': 'Person', '@id': '123', name: 'John' },
        { '@type': 'Person', '@id': '456', name: 'Jane' },
        { '@type': 'Thing', '@id': '789', title: 'Sample' }
    ];

    test('should find record by valid reference', () => {
        const ref = { '@type': 'Person', '@id': '123' };
        const result = arrayHelpers.get(ref, records);
        
        expect(result).toEqual({ '@type': 'Person', '@id': '123', name: 'John' });
    });

    test('should return undefined for non-existent reference', () => {
        const ref = { '@type': 'Person', '@id': '999' };
        const result = arrayHelpers.get(ref, records);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for invalid reference', () => {
        const invalidRef = { name: 'John' }; // missing @type and @id
        const result = arrayHelpers.get(invalidRef, records);
        
        expect(result).toBeUndefined();
    });

    test('should handle single record instead of array', () => {
        const singleRecord = { '@type': 'Person', '@id': '123', name: 'John' };
        const ref = { '@type': 'Person', '@id': '123' };
        const result = arrayHelpers.get(ref, singleRecord);
        
        expect(result).toEqual(singleRecord);
    });

    test('should return undefined for null reference', () => {
        const result = arrayHelpers.get(null, records);
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined reference', () => {
        const result = arrayHelpers.get(undefined, records);
        expect(result).toBeUndefined();
    });

    test('should return undefined for empty records array', () => {
        const ref = { '@type': 'Person', '@id': '123' };
        const result = arrayHelpers.get(ref, []);
        
        expect(result).toBeUndefined();
    });

    test('should handle different types with same id', () => {
        const ref = { '@type': 'Thing', '@id': '123' };
        const result = arrayHelpers.get(ref, records);
        
        expect(result).toBeUndefined(); // Should not match Person with same id
    });
});
