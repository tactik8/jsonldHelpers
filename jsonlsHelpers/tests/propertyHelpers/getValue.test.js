
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getValue', () => {
    test('should return first value from simple property', () => {
        const obj = { name: 'John', age: 30 };
        const result = propertyHelpers.value.get(obj, 'name');
        
        expect(result).toBe('John');
    });

    test('should return first value from array property', () => {
        const obj = { tags: ['red', 'blue', 'green'] };
        const result = propertyHelpers.value.get(obj, 'tags');
        
        expect(result).toBe('red');
    });

    test('should return default value for non-existent property', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, 'age', 25);
        
        expect(result).toBe(25);
    });

    test('should return undefined for non-existent property without default', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, 'age');
        
        expect(result).toBeUndefined();
    });

    test('should handle nested object paths', () => {
        const obj = { 
            person: { 
                name: 'John',
                address: { 
                    street: '123 Main St',
                    city: 'NYC'
                }
            }
        };
        const result = propertyHelpers.value.get(obj, 'person.address.city');
        
        expect(result).toBe('NYC');
    });

    test('should handle array index notation', () => {
        const obj = { 
            people: [
                { name: 'John' },
                { name: 'Jane' }
            ]
        };
        const result = propertyHelpers.value.get(obj, 'people[1].name');
        
        expect(result).toBe('Jane');
    });

    test('should handle mixed path notation', () => {
        const obj = {
            data: {
                items: [
                    { values: ['a', 'b', 'c'] }
                ]
            }
        };
        const result = propertyHelpers.value.get(obj, 'data.items[0].values');
        
        expect(result).toBe('a');
    });

    test('should return default for invalid path', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, 'person.age', 'default');
        
        expect(result).toBe('default');
    });

    test('should handle null object', () => {
        const result = propertyHelpers.value.get(null, 'name', 'default');
        
        expect(result).toBe('default');
    });

    test('should handle undefined object', () => {
        const result = propertyHelpers.value.get(undefined, 'name', 'default');
        
        expect(result).toBe('default');
    });

    test('should handle empty path', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, '');
        
        expect(result).toBe(obj);
    });

    test('should handle null path', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, null);
        
        expect(result).toBe(obj);
    });

    test('should handle array index out of bounds', () => {
        const obj = { items: ['a', 'b'] };
        const result = propertyHelpers.value.get(obj, 'items[5]', 'default');
        
        expect(result).toBe('default');
    });

    test('should handle deep nested arrays', () => {
        const obj = {
            matrix: [
                [1, 2, 3],
                [4, 5, 6]
            ]
        };
        const result = propertyHelpers.value.get(obj, 'matrix[1][2]');
        
        expect(result).toBe(6);
    });
});
