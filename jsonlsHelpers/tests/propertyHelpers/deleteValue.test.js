
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('deleteValue', () => {
    test('should delete specific value from array property', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue', 'green'] };
        const result = propertyHelpers.value.delete(obj, 'tags', 'blue');
        
        expect(result.tags).toEqual(['red', 'green']);
    });

    test('should not modify original object', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };
        const original = structuredClone(obj);
        propertyHelpers.value.delete(obj, 'tags', 'blue');
        
        expect(obj).toEqual(original);
    });

    test('should delete single value property', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.value.delete(obj, 'name', 'John');
        
        expect(result.name).toEqual([]);
    });

    test('should handle non-existent value', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };
        const result = propertyHelpers.value.delete(obj, 'tags', 'yellow');
        
        expect(result.tags).toEqual(['red', 'blue']);
    });

    test('should handle non-existent property', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.value.delete(obj, 'tags', 'blue');
        
        expect(result.tags).toEqual([]);
    });

    test('should handle null values', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', null, 'blue'] };
        const result = propertyHelpers.value.delete(obj, 'tags', null);
        
        expect(result.tags).toEqual(['red', 'blue']);
    });

    test('should handle undefined values', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', undefined, 'blue'] };
        const result = propertyHelpers.value.delete(obj, 'tags', undefined);
        
        expect(result.tags).toEqual(['red', 'blue']);
    });

    test('should handle complex object values', () => {
        const address1 = { '@type': 'Address', '@id': '1', street: '123 Main St' };
        const address2 = { '@type': 'Address', '@id': '2', street: '456 Oak Ave' };
        const obj = { 
            '@type': 'Person', 
            '@id': '123', 
            addresses: [address1, address2] 
        };
        const result = propertyHelpers.value.delete(obj, 'addresses', address1);
        
        expect(result.addresses).toEqual([address2]);
    });

    test('should return undefined for invalid JSON-LD object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.value.delete(obj, 'tags', 'blue');
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null object', () => {
        const result = propertyHelpers.value.delete(null, 'tags', 'blue');
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined object', () => {
        const result = propertyHelpers.value.delete(undefined, 'tags', 'blue');
        
        expect(result).toBeUndefined();
    });

    test('should handle empty array', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: [] };
        const result = propertyHelpers.value.delete(obj, 'tags', 'blue');
        
        expect(result.tags).toEqual([]);
    });

    test('should handle duplicate values', () => {
        const obj = { '@type': 'Person', '@id': '123', tags: ['red', 'blue', 'blue', 'green'] };
        const result = propertyHelpers.value.delete(obj, 'tags', 'blue');
        
        expect(result.tags).toEqual(['red', 'green']);
    });

    test('should handle nested path deletion', () => {
        const obj = { 
            '@type': 'Person', 
            '@id': '123',
            profile: { tags: ['red', 'blue', 'green'] }
        };
        const result = propertyHelpers.value.delete(obj, 'profile.tags', 'blue');
        
        expect(result.profile.tags).toEqual(['red', 'green']);
    });

    test('should handle array index paths', () => {
        const obj = { 
            '@type': 'Person', 
            '@id': '123',
            groups: [
                { tags: ['red', 'blue', 'green'] }
            ]
        };
        const result = propertyHelpers.value.delete(obj, 'groups[0].tags', 'blue');
        
        expect(result.groups[0].tags).toEqual(['red', 'green']);
    });

    test('should handle string values that look like numbers', () => {
        const obj = { '@type': 'Person', '@id': '123', codes: ['123', '456', '789'] };
        const result = propertyHelpers.value.delete(obj, 'codes', '456');
        
        expect(result.codes).toEqual(['123', '789']);
    });

    test('should handle mixed data types', () => {
        const obj = { '@type': 'Person', '@id': '123', mixed: ['string', 123, true, null] };
        const result = propertyHelpers.value.delete(obj, 'mixed', 123);
        
        expect(result.mixed).toEqual(['string', true, null]);
    });
});
