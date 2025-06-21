
import { objectHelpers } from '../../src/src/objectHelpers.js';

describe('diff', () => {
    test('should return differences between two JSON-LD objects', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: 'John', age: 30, city: 'NYC' };
        const obj2 = { '@type': 'Person', '@id': '123', name: 'John', age: 25 };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toEqual({
            age: [30],
            city: ['NYC']
        });
    });

    test('should return empty object for identical objects', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: 'John' };
        const obj2 = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toEqual({});
    });

    test('should handle array values', () => {
        const obj1 = { '@type': 'Person', '@id': '123', tags: ['red', 'blue', 'green'] };
        const obj2 = { '@type': 'Person', '@id': '123', tags: ['red', 'blue'] };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toEqual({
            tags: ['green']
        });
    });

    test('should return undefined for non-JSON-LD objects', () => {
        const obj1 = { name: 'John' }; // missing @type and @id
        const obj2 = { name: 'Jane' };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined if first object is not JSON-LD', () => {
        const obj1 = { name: 'John' };
        const obj2 = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined if second object is not JSON-LD', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: 'John' };
        const obj2 = { name: 'John' };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toBeUndefined();
    });

    test('should handle properties that exist only in first object', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: 'John', age: 30, hobby: 'reading' };
        const obj2 = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toEqual({
            age: [30],
            hobby: ['reading']
        });
    });

    test('should handle null and undefined values', () => {
        const obj1 = { '@type': 'Person', '@id': '123', name: null, age: undefined };
        const obj2 = { '@type': 'Person', '@id': '123' };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toEqual({
            name: [null]
        });
    });

    test('should handle complex nested comparisons', () => {
        const obj1 = {
            '@type': 'Person',
            '@id': '123',
            skills: ['JavaScript', 'Python', 'Java'],
            languages: ['English', 'Spanish']
        };
        const obj2 = {
            '@type': 'Person',
            '@id': '123',
            skills: ['JavaScript', 'Python'],
            languages: ['English']
        };
        const result = objectHelpers.diff(obj1, obj2);
        
        expect(result).toEqual({
            skills: ['Java'],
            languages: ['Spanish']
        });
    });
});
