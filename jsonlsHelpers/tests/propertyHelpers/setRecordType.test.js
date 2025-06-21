
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('setRecordType', () => {
    test('should set @type value in valid JSON-LD object', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(record, 'Organization');
        
        expect(result).toEqual({
            '@type': 'Organization',
            '@id': '123',
            name: 'John'
        });
    });

    test('should not modify original object', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const original = { ...record };
        propertyHelpers.type.set(record, 'Organization');
        
        expect(record).toEqual(original);
    });

    test('should handle null type value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(record, null);
        
        expect(result['@type']).toBeNull();
    });

    test('should handle undefined type value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(record, undefined);
        
        expect(result['@type']).toBeUndefined();
    });

    test('should handle empty string type value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(record, '');
        
        expect(result['@type']).toBe('');
    });

    test('should handle array type value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(record, ['Person', 'Individual']);
        
        expect(result['@type']).toEqual(['Person', 'Individual']);
    });

    test('should return false for invalid JSON-LD object', () => {
        const record = { name: 'John' }; // missing @type
        const result = propertyHelpers.type.set(record, 'Person');
        
        expect(result).toBe(false);
    });

    test('should handle object without @type initially', () => {
        const record = { '@id': '123', name: 'John' };
        const result = propertyHelpers.type.set(record, 'Person');
        
        expect(result).toBe(false); // Should fail validation
    });
});
