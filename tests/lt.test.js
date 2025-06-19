
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('lt', () => {
    test('should compare JSON-LD objects by type first', () => {
        const obj1 = { '@type': 'Person', '@id': '123' };
        const obj2 = { '@type': 'Thing', '@id': '123' };
        const result = objectHelpers.lt(obj1, obj2);
        
        expect(result).toBe(true); // 'Person' < 'Thing'
    });

    test('should compare JSON-LD objects by id when types are same', () => {
        const obj1 = { '@type': 'Person', '@id': '123' };
        const obj2 = { '@type': 'Person', '@id': '456' };
        const result = objectHelpers.lt(obj1, obj2);
        
        expect(result).toBe(true); // '123' < '456'
    });

    test('should return false for identical JSON-LD objects', () => {
        const obj1 = { '@type': 'Person', '@id': '123' };
        const obj2 = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.lt(obj1, obj2);
        
        expect(result).toBe(false);
    });

    test('should handle non-JSON-LD objects', () => {
        const obj1 = { name: 'Alice' };
        const obj2 = { name: 'Bob' };
        const result = objectHelpers.lt(obj1, obj2);
        
        expect(result).toBe(true);
    });

    test('should handle primitive numbers', () => {
        expect(objectHelpers.lt(5, 10)).toBe(true);
        expect(objectHelpers.lt(10, 5)).toBe(false);
        expect(objectHelpers.lt(5, 5)).toBe(false);
    });

    test('should handle primitive strings', () => {
        expect(objectHelpers.lt('apple', 'banana')).toBe(true);
        expect(objectHelpers.lt('banana', 'apple')).toBe(false);
        expect(objectHelpers.lt('apple', 'apple')).toBe(false);
    });

    test('should handle mixed JSON-LD and non-JSON-LD objects', () => {
        const jsonld = { '@type': 'Person', '@id': '123' };
        const regular = { name: 'John' };
        const result = objectHelpers.lt(jsonld, regular);
        
        // Should fallback to string comparison
        expect(typeof result).toBe('boolean');
    });

    test('should handle Date objects', () => {
        const date1 = new Date('2023-01-01');
        const date2 = new Date('2023-12-31');
        const result = objectHelpers.lt(date1, date2);
        
        expect(result).toBe(true);
    });

    test('should handle null and undefined', () => {
        expect(objectHelpers.lt(null, 'something')).toBe(true);
        expect(objectHelpers.lt(undefined, 'something')).toBe(true);
    });
});
