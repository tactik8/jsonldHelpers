
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('gt', () => {
    test('should compare JSON-LD objects by type first', () => {
        const obj1 = { '@type': 'Thing', '@id': '123' };
        const obj2 = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.gt(obj1, obj2);
        
        expect(result).toBe(true); // 'Thing' > 'Person'
    });

    test('should compare JSON-LD objects by id when types are same', () => {
        const obj1 = { '@type': 'Person', '@id': '456' };
        const obj2 = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.gt(obj1, obj2);
        
        expect(result).toBe(true); // '456' > '123'
    });

    test('should return false for identical JSON-LD objects', () => {
        const obj1 = { '@type': 'Person', '@id': '123' };
        const obj2 = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.gt(obj1, obj2);
        
        expect(result).toBe(false);
    });

    test('should handle non-JSON-LD objects', () => {
        const obj1 = { name: 'Bob' };
        const obj2 = { name: 'Alice' };
        const result = objectHelpers.gt(obj1, obj2);
        
        expect(result).toBe(true);
    });

    test('should handle primitive numbers', () => {
        expect(objectHelpers.gt(10, 5)).toBe(true);
        expect(objectHelpers.gt(5, 10)).toBe(false);
        expect(objectHelpers.gt(5, 5)).toBe(false);
    });

    test('should handle primitive strings', () => {
        expect(objectHelpers.gt('banana', 'apple')).toBe(true);
        expect(objectHelpers.gt('apple', 'banana')).toBe(false);
        expect(objectHelpers.gt('apple', 'apple')).toBe(false);
    });

    test('should handle mixed JSON-LD and non-JSON-LD objects', () => {
        const jsonld = { '@type': 'Person', '@id': '123' };
        const regular = { name: 'John' };
        const result = objectHelpers.gt(jsonld, regular);
        
        // Should fallback to string comparison
        expect(typeof result).toBe('boolean');
    });

    test('should handle Date objects', () => {
        const date1 = new Date('2023-12-31');
        const date2 = new Date('2023-01-01');
        const result = objectHelpers.gt(date1, date2);
        
        expect(result).toBe(true);
    });

    test('should handle null and undefined', () => {
        expect(objectHelpers.gt('something', null)).toBe(true);
        expect(objectHelpers.gt('something', undefined)).toBe(true);
    });
});
