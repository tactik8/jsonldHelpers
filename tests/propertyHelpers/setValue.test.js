
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('setValue', () => {
    test('should set simple property value', () => {
        const obj = { name: 'John', age: 30 };
        const result = propertyHelpers.value.set(obj, 'name', 'Jane');
        
        expect(result).toEqual({ name: 'Jane', age: 30 });
    });

    test('should not modify original object', () => {
        const obj = { name: 'John', age: 30 };
        const original = { ...obj };
        propertyHelpers.value.set(obj, 'name', 'Jane');
        
        expect(obj).toEqual(original);
    });

    test('should add new property', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'age', 30);
        
        expect(result).toEqual({ name: 'John', age: 30 });
    });

    test('should handle array values', () => {
        const obj = { tags: ['red'] };
        const result = propertyHelpers.value.set(obj, 'tags', ['blue', 'green']);
        
        expect(result).toEqual({ tags: ['blue', 'green'] });
    });

    test('should handle nested object paths', () => {
        const obj = { 
            person: { 
                name: 'John',
                address: { 
                    city: 'NYC'
                }
            }
        };
        const result = propertyHelpers.value.set(obj, 'person.address.city', 'LA');
        
        expect(result.person.address.city).toBe('LA');
    });

    test('should create nested structure if not exists', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'person.address.city', 'NYC');
        
        expect(result).toEqual({
            name: 'John',
            person: {
                address: {
                    city: 'NYC'
                }
            }
        });
    });

    test('should handle array index notation', () => {
        const obj = { 
            people: [
                { name: 'John' },
                { name: 'Jane' }
            ]
        };
        const result = propertyHelpers.value.set(obj, 'people[1].name', 'Janet');
        
        expect(result.people[1].name).toBe('Janet');
    });

    test('should expand array if index is out of bounds', () => {
        const obj = { items: ['a', 'b'] };
        const result = propertyHelpers.value.set(obj, 'items[4]', 'e');
        
        expect(result.items).toEqual(['a', 'b', undefined, undefined, 'e']);
    });

    test('should handle null object', () => {
        const result = propertyHelpers.value.set(null, 'name', 'John', 'default');
        
        expect(result).toBe('default');
    });

    test('should handle undefined object', () => {
        const result = propertyHelpers.value.set(undefined, 'name', 'John', 'default');
        
        expect(result).toBe('default');
    });

    test('should handle invalid path type', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 123, 'value', 'default');
        
        expect(result).toBe('default');
    });

    test('should return same object if value is already equal', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'name', 'John');
        
        expect(result).toBe(obj);
    });

    test('should handle null values', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'name', null);
        
        expect(result.name).toBeNull();
    });

    test('should handle undefined values', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'name', undefined);
        
        expect(result.name).toBeUndefined();
    });

    test('should handle deep nested arrays', () => {
        const obj = {
            matrix: [
                [1, 2],
                [3, 4]
            ]
        };
        const result = propertyHelpers.value.set(obj, 'matrix[1][1]', 10);
        
        expect(result.matrix[1][1]).toBe(10);
    });

    test('should handle mixed array and object paths', () => {
        const obj = {
            users: [
                { profile: { name: 'John' } }
            ]
        };
        const result = propertyHelpers.value.set(obj, 'users[0].profile.name', 'Jane');
        
        expect(result.users[0].profile.name).toBe('Jane');
    });
});
