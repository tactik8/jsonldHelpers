
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getRecordType', () => {
    test('should return the @type value from valid JSON-LD object', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.get(record);
        
        expect(result).toBe('Person');
    });

    test('should return undefined for invalid JSON-LD object', () => {
        const record = { name: 'John' }; // missing @type
        const result = propertyHelpers.type.get(record);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null input', () => {
        const result = propertyHelpers.type.get(null);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined input', () => {
        const result = propertyHelpers.type.get(undefined);
        
        expect(result).toBeUndefined();
    });

    test('should return array @type value', () => {
        const record = { '@type': ['Person', 'Individual'], '@id': '123', name: 'John' };
        const result = propertyHelpers.type.get(record);
        
        expect(result).toBe('Person'); // Should return first value
    });

    test('should return null @type value', () => {
        const record = { '@type': null, '@id': '123', name: 'John' };
        const result = propertyHelpers.type.get(record);
        
        expect(result).toBeNull();
    });

    test('should return empty string @type value', () => {
        const record = { '@type': '', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.get(record);
        
        expect(result).toBe('');
    });

    test('should return undefined for non-object input', () => {
        expect(propertyHelpers.type.get('string')).toBeUndefined();
        expect(propertyHelpers.type.get(123)).toBeUndefined();
        expect(propertyHelpers.type.get(true)).toBeUndefined();
    });

    test('should return undefined for array input', () => {
        const arr = [{ '@type': 'Person', '@id': '123' }];
        const result = propertyHelpers.type.get(arr);
        
        expect(result).toBeUndefined();
    });
});
