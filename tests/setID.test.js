
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('setID', () => {
    test('should set ID for object without ID', () => {
        const obj = { '@type': 'Person', name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toHaveProperty('@id');
        expect(typeof result['@id']).toBe('string');
        expect(result['@id']).toHaveLength(36);
    });

    test('should not modify object that already has ID', () => {
        const originalId = 'existing-id';
        const obj = { '@type': 'Person', '@id': originalId, name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result['@id']).toBe(originalId);
    });

    test('should return undefined for object without @type', () => {
        const obj = { name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for object with null @type', () => {
        const obj = { '@type': null, name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toBeUndefined();
    });

    test('should handle null input', () => {
        const result = objectHelpers.setID(null);
        expect(result).toBe(null);
    });

    test('should handle undefined input', () => {
        const result = objectHelpers.setID(undefined);
        expect(result).toBe(undefined);
    });

    test('should handle primitive values', () => {
        expect(objectHelpers.setID('string')).toBe('string');
        expect(objectHelpers.setID(123)).toBe(123);
        expect(objectHelpers.setID(true)).toBe(true);
    });

    test('should set ID for object with null @id', () => {
        const obj = { '@type': 'Person', '@id': null, name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toHaveProperty('@id');
        expect(result['@id']).not.toBeNull();
        expect(typeof result['@id']).toBe('string');
    });
});
