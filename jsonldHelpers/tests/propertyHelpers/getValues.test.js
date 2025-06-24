
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getValues', () => {
    test('should return array for simple property', () => {
        const obj = { name: 'John', age: 30 };
        const result = propertyHelpers.values.get(obj, 'name');
        
        expect(result).toEqual(['John']);
    });

    test('should return array for array property', () => {
        const obj = { tags: ['red', 'blue', 'green'] };
        const result = propertyHelpers.values.get(obj, 'tags');
        
        expect(result).toEqual(['red', 'blue', 'green']);
    });

    test('should return default value for non-existent property', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, 'age', ['default']);
        
        expect(result).toEqual(['default']);
    });

    test('should return undefined for non-existent property without default', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, 'age');
        
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
        const result = propertyHelpers.values.get(obj, 'person.address.city');
        
        expect(result).toEqual(['NYC']);
    });

    test('should handle array index notation', () => {
        const obj = { 
            people: [
                { name: 'John' },
                { name: 'Jane' }
            ]
        };
        const result = propertyHelpers.values.get(obj, 'people[1].name');
        
        expect(result).toEqual(['Jane']);
    });

    test('should handle mixed path notation', () => {
        const obj = {
            data: {
                items: [
                    { values: ['a', 'b', 'c'] }
                ]
            }
        };
        const result = propertyHelpers.values.get(obj, 'data.items[0].values');
        
        expect(result).toEqual(['a', 'b', 'c']);
    });

    test('should return default for invalid path', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, 'person.age', ['default']);
        
        expect(result).toEqual(['default']);
    });

    test('should handle null object', () => {
        const result = propertyHelpers.values.get(null, 'name', ['default']);
        
        expect(result).toEqual(['default']);
    });

    test('should handle undefined object', () => {
        const result = propertyHelpers.values.get(undefined, 'name', ['default']);
        
        expect(result).toEqual(['default']);
    });

    test('should handle empty path', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, '');
        
        expect(result).toEqual([obj]);
    });

    test('should handle null path', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, null);
        
        expect(result).toEqual([obj]);
    });

    test('should handle array index out of bounds', () => {
        const obj = { items: ['a', 'b'] };
        const result = propertyHelpers.values.get(obj, 'items[5]', ['default']);
        
        expect(result).toEqual(['default']);
    });

    test('should handle null values in array', () => {
        const obj = { items: [null, 'value', undefined] };
        const result = propertyHelpers.values.get(obj, 'items');
        
        expect(result).toEqual([null, 'value', undefined]);
    });

    test('should convert non-array to array', () => {
        const obj = { count: 5 };
        const result = propertyHelpers.values.get(obj, 'count');
        
        expect(result).toEqual([5]);
    });
});
