
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('setRecordId', () => {
    test('should set @id value in valid JSON-LD object', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(record, '456');
        
        expect(result).toEqual({
            '@type': 'Person',
            '@id': '456',
            name: 'John'
        });
    });

    test('should not modify original object', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const original = { ...record };
        propertyHelpers.id.set(record, '456');
        
        expect(record).toEqual(original);
    });

    test('should handle null id value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(record, null);
        
        expect(result['@id']).toBeNull();
    });

    test('should handle undefined id value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(record, undefined);
        
        expect(result['@id']).toBeUndefined();
    });

    test('should handle empty string id value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(record, '');
        
        expect(result['@id']).toBe('');
    });

    test('should handle array id value', () => {
        const record = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.set(record, ['456', '789']);
        
        expect(result['@id']).toEqual(['456', '789']);
    });

    test('should return false for invalid JSON-LD object', () => {
        const record = { name: 'John' }; // missing @type
        const result = propertyHelpers.id.set(record, '123');
        
        expect(result).toBe(false);
    });

    test('should handle object without @id initially', () => {
        const record = { '@type': 'Person', name: 'John' };
        const result = propertyHelpers.id.set(record, '123');
        
        expect(result).toEqual({
            '@type': 'Person',
            name: 'John',
            '@id': '123'
        });
    });
});
