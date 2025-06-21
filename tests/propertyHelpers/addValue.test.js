
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('addValue', () => {
    test('should add value to existing property', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red'] };
        const result = propertyHelpers.value.add(obj, 'tags', 'blue');
        
        expect(result.tags).toEqual(['red', 'blue']);
    });

    test('should create new property with value', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.value.add(obj, 'tags', 'blue');
        
        expect(result.tags).toEqual(['blue']);
    });

    test('should handle array of values', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red'] };
        const result = propertyHelpers.value.add(obj, 'tags', ['blue', 'green']);
        
        expect(result.tags).toEqual(['red', 'blue', 'green']);
    });

    test('should not modify original object', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red'] };
        const original = structuredClone(obj);
        propertyHelpers.value.add(obj, 'tags', 'blue');
        
        expect(obj).toEqual(original);
    });

    test('should handle noDuplicates option', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };
        const result = propertyHelpers.value.add(obj, 'tags', 'red', true);
        
        expect(result.tags).toEqual(['blue', 'red']);
    });

    test('should handle noDuplicates with new value', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };
        const result = propertyHelpers.value.add(obj, 'tags', 'green', true);
        
        expect(result.tags).toEqual(['red', 'blue', 'green']);
    });

    test('should handle noDuplicates with array of values', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };
        const result = propertyHelpers.value.add(obj, 'tags', ['red', 'green', 'blue'], true);
        
        expect(result.tags).toEqual(['red', 'green', 'blue']);
    });

    test('should return false for invalid JSON-LD object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.value.add(obj, 'tags', 'blue');
        
        expect(result).toBe(false);
    });

    test('should handle null object', () => {
        const result = propertyHelpers.value.add(null, 'tags', 'blue');
        
        expect(result).toBe(false);
    });

    test('should handle undefined object', () => {
        const result = propertyHelpers.value.add(undefined, 'tags', 'blue');
        
        expect(result).toBe(false);
    });

    test('should handle empty array initially', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: [] };
        const result = propertyHelpers.value.add(obj, 'tags', 'blue');
        
        expect(result.tags).toEqual(['blue']);
    });

    test('should handle null values', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red'] };
        const result = propertyHelpers.value.add(obj, 'tags', null);
        
        expect(result.tags).toEqual(['red', null]);
    });

    test('should handle undefined values', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red'] };
        const result = propertyHelpers.value.add(obj, 'tags', undefined);
        
        expect(result.tags).toEqual(['red', undefined]);
    });

    test('should handle complex object values', () => {
        const obj = { '@type': 'Person', '@id': '123', addresses: [] };
        const address = { street: '123 Main St', city: 'NYC' };
        const result = propertyHelpers.value.add(obj, 'addresses', address);
        
        expect(result.addresses).toEqual([address]);
    });

    test('should handle nested path addition', () => {
        const obj = { 
            '@type': 'Person', 
            '@id': '123',
            profile: { tags: ['red'] }
        };
        const result = propertyHelpers.value.add(obj, 'profile.tags', 'blue');
        
        expect(result.profile.tags).toEqual(['red', 'blue']);
    });

    test('should handle array index paths', () => {
        const obj = { 
            '@type': 'Person', 
            '@id': '123',
            groups: [
                { tags: ['red'] }
            ]
        };
        const result = propertyHelpers.value.add(obj, 'groups[0].tags', 'blue');
        
        expect(result.groups[0].tags).toEqual(['red', 'blue']);
    });
});
