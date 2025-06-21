
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getRecordId', () => {
    test('should return the @id value from valid JSON-LD object', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.get(record);
        
        expect(result).toBe('123');
    });

    test('should return undefined for invalid JSON-LD object', () => {
        const record = { name: 'John' }; // missing @type
        const result = propertyHelpers.id.get(record);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null input', () => {
        const result = propertyHelpers.id.get(null);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined input', () => {
        const result = propertyHelpers.id.get(undefined);
        
        expect(result).toBeUndefined();
    });

    test('should return array @id value', () => {
        const record = { '@type': 'Person', '@id': ['123', '456'], name: 'John' };
        const result = propertyHelpers.id.get(record);
        
        expect(result).toBe('123'); // Should return first value
    });

    test('should return null @id value', () => {
        const record = { '@type': 'Person', '@id': null, name: 'John' };
        const result = propertyHelpers.id.get(record);
        
        expect(result).toBeNull();
    });

    test('should return empty string @id value', () => {
        const record = { '@type': 'Person', '@id': '', name: 'John' };
        const result = propertyHelpers.id.get(record);
        
        expect(result).toBe('');
    });

    test('should return undefined for non-object input', () => {
        expect(propertyHelpers.id.get('string')).toBeUndefined();
        expect(propertyHelpers.id.get(123)).toBeUndefined();
        expect(propertyHelpers.id.get(true)).toBeUndefined();
    });

    test('should return undefined for array input', () => {
        const arr = [{ '@type': 'Person', '@id': '123' }];
        const result = propertyHelpers.id.get(arr);
        
        expect(result).toBeUndefined();
    });

    test('should handle object with @type but no @id', () => {
        const record = { '@type': 'Person', name: 'John' };
        const result = propertyHelpers.id.get(record);
        
        expect(result).toBeUndefined();
    });
});
