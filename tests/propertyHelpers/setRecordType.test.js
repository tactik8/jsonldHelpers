
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('setRecordType', () => {
    test('should set type of valid JSON-LD object', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(obj, 'Organization');
        
        expect(result).toBe(true);
        expect(obj['@type']).toBe('Organization');
    });

    test('should set type to array value', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(obj, ['Organization', 'LocalBusiness']);
        
        expect(result).toBe(true);
        expect(obj['@type']).toEqual(['Organization', 'LocalBusiness']);
    });

    test('should set type to null', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(obj, null);
        
        expect(result).toBe(true);
        expect(obj['@type']).toBe(null);
    });

    test('should set type to empty string', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(obj, '');
        
        expect(result).toBe(true);
        expect(obj['@type']).toBe('');
    });

    test('should not modify if same type', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const originalObj = { ...obj };
        const result = propertyHelpers.type.set(obj, 'Person');
        
        expect(result).toBe(obj);
        expect(obj).toEqual(originalObj);
    });

    test('should handle invalid object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.type.set(obj, 'Person');
        
        expect(result).toBe(false);
    });

    test('should handle null object', () => {
        const result = propertyHelpers.type.set(null, 'Person');
        
        expect(result).toBe(false);
    });

    test('should handle undefined object', () => {
        const result = propertyHelpers.type.set(undefined, 'Person');
        
        expect(result).toBe(false);
    });
});
