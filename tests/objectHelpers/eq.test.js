
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('eq', () => {
    test('should return true for identical JSON-LD objects', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: 'John' };
        const obj2 = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = objectHelpers.eq(obj1, obj2);
        
        expect(result).toBe(true);
    });

    test('should return false for different JSON-LD objects', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: 'John' };
        const obj2 = { '@type': 'Person', '@id': '123', name: 'Jane' };
        const result = objectHelpers.eq(obj1, obj2);
        
        expect(result).toBe(false);
    });

    test('should handle non-JSON-LD objects using JSON comparison', () => {
        const obj1 = { name: 'John', age: 30 };
        const obj2 = { age: 30, name: 'John' };
        const result = objectHelpers.eq(obj1, obj2);
        
        expect(result).toBe(true);
    });

    test('should return false for different non-JSON-LD objects', () => {
        const obj1 = { name: 'John', age: 30 };
        const obj2 = { name: 'Jane', age: 30 };
        const result = objectHelpers.eq(obj1, obj2);
        
        expect(result).toBe(false);
    });

    test('should handle primitive values', () => {
        expect(objectHelpers.eq('hello', 'hello')).toBe(true);
        expect(objectHelpers.eq('hello', 'world')).toBe(false);
        expect(objectHelpers.eq(123, 123)).toBe(true);
        expect(objectHelpers.eq(123, 456)).toBe(false);
    });

    test('should handle null values', () => {
        expect(objectHelpers.eq(null, null)).toBe(true);
        expect(objectHelpers.eq(null, undefined)).toBe(false);
    });

    test('should handle undefined values', () => {
        expect(objectHelpers.eq(undefined, undefined)).toBe(true);
        expect(objectHelpers.eq(undefined, null)).toBe(false);
    });

    test('should handle mixed JSON-LD and non-JSON-LD objects', () => {
        const jsonld = { '@type': 'Person', '@id': '123', name: 'John' };
        const regular = { name: 'John' };
        const result = objectHelpers.eq(jsonld, regular);
        
        expect(result).toBe(false);
    });

    test('should handle objects with different property orders', () => {
        const obj1 = { a: 1, b: 2, c: 3 };
        const obj2 = { c: 3, a: 1, b: 2 };
        const result = objectHelpers.eq(obj1, obj2);
        
        expect(result).toBe(true);
    });
});
