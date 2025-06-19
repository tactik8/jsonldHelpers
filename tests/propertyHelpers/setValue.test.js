
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('setValue', () => {
    test('should set simple property value', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'age', 30);
        
        expect(result).toBe(true);
        expect(obj.age).toBe(30);
    });

    test('should update existing property value', () => {
        const obj = { name: 'John', age: 25 };
        const result = propertyHelpers.value.set(obj, 'age', 30);
        
        expect(result).toBe(true);
        expect(obj.age).toBe(30);
    });

    test('should set nested property using dot notation', () => {
        const obj = { person: {} };
        const result = propertyHelpers.value.set(obj, 'person.name', 'John');
        
        expect(result).toBe(true);
        expect(obj.person.name).toBe('John');
    });

    test('should create nested objects automatically', () => {
        const obj = {};
        const result = propertyHelpers.value.set(obj, 'person.address.street', '123 Main St');
        
        expect(result).toBe(true);
        expect(obj.person.address.street).toBe('123 Main St');
    });

    test('should set array element using bracket notation', () => {
        const obj = { items: ['apple', 'banana'] };
        const result = propertyHelpers.value.set(obj, 'items[1]', 'cherry');
        
        expect(result).toBe(true);
        expect(obj.items[1]).toBe('cherry');
    });

    test('should create arrays automatically', () => {
        const obj = {};
        const result = propertyHelpers.value.set(obj, 'items[0]', 'first');
        
        expect(result).toBe(true);
        expect(obj.items).toEqual(['first']);
    });

    test('should extend array if index is beyond length', () => {
        const obj = { items: ['apple'] };
        const result = propertyHelpers.value.set(obj, 'items[3]', 'banana');
        
        expect(result).toBe(true);
        expect(obj.items).toEqual(['apple', undefined, undefined, 'banana']);
    });

    test('should set nested array element', () => {
        const obj = { data: [{ items: [] }] };
        const result = propertyHelpers.value.set(obj, 'data[0].items[0]', 'value');
        
        expect(result).toBe(true);
        expect(obj.data[0].items[0]).toBe('value');
    });

    test('should return object unchanged if value is same', () => {
        const obj = { name: 'John', age: 30 };
        const originalObj = { ...obj };
        const result = propertyHelpers.value.set(obj, 'name', 'John');
        
        expect(result).toBe(obj);
        expect(obj).toEqual(originalObj);
    });

    test('should handle setting array values', () => {
        const obj = {};
        const result = propertyHelpers.value.set(obj, 'skills', ['JavaScript', 'Python']);
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['JavaScript', 'Python']);
    });

    test('should return false for null object', () => {
        const result = propertyHelpers.value.set(null, 'name', 'John');
        
        expect(result).toBe(false);
    });

    test('should return false for undefined object', () => {
        const result = propertyHelpers.value.set(undefined, 'name', 'John');
        
        expect(result).toBe(false);
    });

    test('should return false for invalid path type', () => {
        const obj = {};
        const result = propertyHelpers.value.set(obj, 123, 'value');
        
        expect(result).toBe(false);
    });

    test('should handle setting null value', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'name', null);
        
        expect(result).toBe(true);
        expect(obj.name).toBe(null);
    });

    test('should handle setting undefined value', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.value.set(obj, 'name', undefined);
        
        expect(result).toBe(true);
        expect(obj.name).toBe(undefined);
    });

    test('should return default value when provided', () => {
        const result = propertyHelpers.value.set(null, 'name', 'John', 'defaultResult');
        
        expect(result).toBe('defaultResult');
    });
});
