
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getValues', () => {
    test('should get simple property value as single item', () => {
        const obj = { name: 'John', age: 30 };
        const result = propertyHelpers.values.get(obj, 'name');
        
        expect(result).toBe('John');
    });

    test('should get array property', () => {
        const obj = { skills: ['JavaScript', 'Python', 'Java'] };
        const result = propertyHelpers.values.get(obj, 'skills');
        
        expect(result).toEqual(['JavaScript', 'Python', 'Java']);
    });

    test('should get nested property using dot notation', () => {
        const obj = { 
            person: { 
                address: { 
                    street: '123 Main St' 
                } 
            } 
        };
        const result = propertyHelpers.values.get(obj, 'person.address.street');
        
        expect(result).toBe('123 Main St');
    });

    test('should get array element using bracket notation', () => {
        const obj = { items: ['apple', 'banana', 'cherry'] };
        const result = propertyHelpers.values.get(obj, 'items[1]');
        
        expect(result).toBe('banana');
    });

    test('should get nested array element', () => {
        const obj = { 
            data: [
                { name: 'John' },
                { name: 'Jane' }
            ]
        };
        const result = propertyHelpers.values.get(obj, 'data[1].name');
        
        expect(result).toBe('Jane');
    });

    test('should handle complex path with multiple arrays', () => {
        const obj = {
            users: [
                { 
                    posts: [
                        { title: 'First Post' },
                        { title: 'Second Post' }
                    ]
                }
            ]
        };
        const result = propertyHelpers.values.get(obj, 'users[0].posts[1].title');
        
        expect(result).toBe('Second Post');
    });

    test('should return undefined for non-existent property', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, 'age');
        
        expect(result).toBeUndefined();
    });

    test('should return default value for non-existent property', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, 'age', [25]);
        
        expect(result).toEqual([25]);
    });

    test('should return undefined for null object', () => {
        const result = propertyHelpers.values.get(null, 'name');
        
        expect(result).toBeUndefined();
    });

    test('should return default value for null object', () => {
        const result = propertyHelpers.values.get(null, 'name', 'default');
        
        expect(result).toBe('default');
    });

    test('should return undefined for undefined object', () => {
        const result = propertyHelpers.values.get(undefined, 'name');
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for invalid path type', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, 123);
        
        expect(result).toBeUndefined();
    });

    test('should handle array index out of bounds', () => {
        const obj = { items: ['apple', 'banana'] };
        const result = propertyHelpers.values.get(obj, 'items[5]');
        
        expect(result).toBeUndefined();
    });

    test('should handle deep nested paths', () => {
        const obj = {
            level1: {
                level2: {
                    level3: {
                        level4: 'deep value'
                    }
                }
            }
        };
        const result = propertyHelpers.values.get(obj, 'level1.level2.level3.level4');
        
        expect(result).toBe('deep value');
    });

    test('should handle empty string path', () => {
        const obj = { name: 'John' };
        const result = propertyHelpers.values.get(obj, '');
        
        expect(result).toBeUndefined();
    });
});
