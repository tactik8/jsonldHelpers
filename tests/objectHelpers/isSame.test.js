
import { objectHelpers } from '../../src/src/objectHelpers.js';

describe('isSame', () => {
    test('should return true for same JSON-LD objects', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: 'John' };
        const obj2 = { '@type': 'Person', '@id': '123', age: 30 };
        const result = objectHelpers.isSame(obj1, obj2);
        
        expect(result).toBe(true);
    });

    test('should return false for different types', () => {
        const obj1 = { '@type': 'Person', '@id': '123' };
        const obj2 = { '@type': 'Thing', '@id': '123' };
        const result = objectHelpers.isSame(obj1, obj2);
        
        expect(result).toBe(false);
    });

    test('should return false for different ids', () => {
        const obj1 = { '@type': 'Person', '@id': '123' };
        const obj2 = { '@type': 'Person', '@id': '456' };
        const result = objectHelpers.isSame(obj1, obj2);
        
        expect(result).toBe(false);
    });

    test('should handle non-JSON-LD objects with simple equality', () => {
        expect(objectHelpers.isSame('hello', 'hello')).toBe(true);
        expect(objectHelpers.isSame('hello', 'world')).toBe(false);
        expect(objectHelpers.isSame(123, 123)).toBe(true);
        expect(objectHelpers.isSame(123, 456)).toBe(false);
    });

    test('should handle arrays with same elements', () => {
        const arr1 = [
            { '@type': 'Person', '@id': '123' },
            { '@type': 'Person', '@id': '456' }
        ];
        const arr2 = [
            { '@type': 'Person', '@id': '456' },
            { '@type': 'Person', '@id': '123' }
        ];
        const result = objectHelpers.isSame(arr1, arr2);
        
        expect(result).toBe(true);
    });

    test('should handle arrays with different lengths', () => {
        const arr1 = [{ '@type': 'Person', '@id': '123' }];
        const arr2 = [
            { '@type': 'Person', '@id': '123' },
            { '@type': 'Person', '@id': '456' }
        ];
        const result = objectHelpers.isSame(arr1, arr2);
        
        expect(result).toBe(false);
    });

    test('should handle array vs non-array', () => {
        const arr = [{ '@type': 'Person', '@id': '123' }];
        const obj = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.isSame(arr, obj);
        
        expect(result).toBe(true); // Array is converted to single element comparison
    });

    test('should return false for objects missing required properties', () => {
        const obj1 = { '@type': 'Person', name: 'John' }; // missing @id
        const obj2 = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.isSame(obj1, obj2);
        
        expect(result).toBe(false);
    });

    test('should handle null and undefined', () => {
        expect(objectHelpers.isSame(null, null)).toBe(true);
        expect(objectHelpers.isSame(undefined, undefined)).toBe(true);
        expect(objectHelpers.isSame(null, undefined)).toBe(false);
    });

    test('should handle empty arrays', () => {
        const result = objectHelpers.isSame([], []);
        expect(result).toBe(true);
    });
});
