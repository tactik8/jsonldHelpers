
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('setRecordId', () => {
    test('should set id of valid JSON-LD object', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(obj, '456');
        
        expect(result).toBe(true);
        expect(obj['@id']).toBe('456');
    });

    test('should set id to array value', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(obj, ['456', '789']);
        
        expect(result).toBe(true);
        expect(obj['@id']).toEqual(['456', '789']);
    });

    test('should set id to null', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(obj, null);
        
        expect(result).toBe(true);
        expect(obj['@id']).toBe(null);
    });

    test('should set id to empty string', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(obj, '');
        
        expect(result).toBe(true);
        expect(obj['@id']).toBe('');
    });

    test('should not modify if same id', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const originalObj = { ...obj };
        const result = propertyHelpers.id.set(obj, '123');
        
        expect(result).toBe(obj);
        expect(obj).toEqual(originalObj);
    });

    test('should handle invalid object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.id.set(obj, '123');
        
        expect(result).toBe(false);
    });

    test('should handle null object', () => {
        const result = propertyHelpers.id.set(null, '123');
        
        expect(result).toBe(false);
    });

    test('should handle undefined object', () => {
        const result = propertyHelpers.id.set(undefined, '123');
        
        expect(result).toBe(false);
    });
});
