
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getValue', () => {
    test('should get simple property value', () => {
        const obj = { name: 'John', age: 30 };
        const result = propertyHelpers.value.get(obj, 'name');
        
        expect(result).toBe('John');
    });

    test('should get first value from array property', () => {
        const obj = { skills: ['JavaScript', 'Python', 'Java'] };
        const result = propertyHelpers.value.get(obj, 'skills');
        
        expect(result).toBe('JavaScript');
    });

    test('should get nested property using dot notation', () => {
        const obj = { 
            person: { 
                address: { 
                    street: '123 Main St' 
                } 
            } 
        };
        const result = propertyHelpers.value.get(obj, 'person.address.street');
        
        expect(result).toBe('123 Main St');
    });

    test('should get array element using bracket notation', () => {
        const obj = { items: ['apple', 'banana', 'cherry'] };
        const result = propertyHelpers.value.get(obj, 'items[1]');
        
        expect(result).toBe('banana');
    });

    test('should get nested array element', () => {
        const obj = { 
            data: [
                { name: 'John' },
                { name: 'Jane' }
            ]
        };
        const result = propertyHelpers.value.get(obj, 'data[1].name');
        
        expect(result).toBe('Jane');
    });

    test('should return undefined for non-existent property', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, 'age');
        
        expect(result).toBeUndefined();
    });

    test('should return default value for non-existent property', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, 'age', 25);
        
        expect(result).toBe(25);
    });

    test('should return undefined for null object', () => {
        const result = propertyHelpers.value.get(null, 'name');
        
        expect(result).toBeUndefined();
    });

    test('should return default value for null object', () => {
        const result = propertyHelpers.value.get(null, 'name', 'default');
        
        expect(result).toBe('default');
    });

    test('should return undefined for undefined object', () => {
        const result = propertyHelpers.value.get(undefined, 'name');
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for invalid path type', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.get(obj, 123);
        
        expect(result).toBeUndefined();
    });

    test('should handle array index out of bounds', () => {
        const obj = { items: ['apple', 'banana'] };
        const result = propertyHelpers.value.get(obj, 'items[5]');
        
        expect(result).toBeUndefined();
    });

    test('should handle accessing property on primitive value', () => {
        const obj = { data: 'string' };
        const result = propertyHelpers.value.get(obj, 'data.length');
        
        expect(result).toBeUndefined();
    });
});
