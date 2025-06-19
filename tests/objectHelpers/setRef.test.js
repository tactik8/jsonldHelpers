
import { objectHelpers } from '../../src/src/objectHelpers.js';

describe('setRef', () => {
    test('should set reference properties on object', () => {
        const obj = { name: 'John' };
        const ref = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.ref.set(obj, ref);
        
        expect(result).toHaveProperty('@type', 'Person');
        expect(result).toHaveProperty('@id', '123');
        expect(result).toHaveProperty('name', 'John');
    });

    test('should overwrite existing reference properties', () => {
        const obj = { '@type': 'Thing', '@id': 'old-id', name: 'John' };
        const ref = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.ref.set(obj, ref);
        
        expect(result).toHaveProperty('@type', 'Person');
        expect(result).toHaveProperty('@id', '123');
        expect(result).toHaveProperty('name', 'John');
    });

    test('should handle undefined ref', () => {
        const obj = { name: 'John' };
        const result = objectHelpers.ref.set(obj, undefined);
        
        expect(result).toHaveProperty('@type', undefined);
        expect(result).toHaveProperty('@id', undefined);
        expect(result).toHaveProperty('name', 'John');
    });

    test('should handle null ref', () => {
        const obj = { name: 'John' };
        const result = objectHelpers.ref.set(obj, null);
        
        expect(result).toHaveProperty('@type', undefined);
        expect(result).toHaveProperty('@id', undefined);
        expect(result).toHaveProperty('name', 'John');
    });

    test('should handle ref with missing properties', () => {
        const obj = { name: 'John' };
        const ref = { '@type': 'Person' }; // missing @id
        const result = objectHelpers.ref.set(obj, ref);
        
        expect(result).toHaveProperty('@type', 'Person');
        expect(result).toHaveProperty('@id', undefined);
        expect(result).toHaveProperty('name', 'John');
    });

    test('should return the same object reference', () => {
        const obj = { name: 'John' };
        const ref = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.ref.set(obj, ref);
        
        expect(result).toBe(obj);
    });

    test('should handle empty ref object', () => {
        const obj = { name: 'John' };
        const ref = {};
        const result = objectHelpers.ref.set(obj, ref);
        
        expect(result).toHaveProperty('@type', undefined);
        expect(result).toHaveProperty('@id', undefined);
        expect(result).toHaveProperty('name', 'John');
    });
});
