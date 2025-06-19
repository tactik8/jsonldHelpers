
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getProperties', () => {
    test('should return properties of valid JSON-LD object', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John', age: 30 };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual(['age', 'name']);
    });

    test('should exclude @type, @id, and @context from properties', () => {
        const obj = { 
            '@context': 'https://schema.org/', 
            '@type': 'Person', 
            '@id': '123', 
            name: 'John', 
            age: 30 
        };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual(['age', 'name']);
        expect(result).not.toContain('@type');
        expect(result).not.toContain('@id');
        expect(result).not.toContain('@context');
    });

    test('should return empty array for object with only JSON-LD properties', () => {
        const obj = { '@type': 'Person', '@id': '123' };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual([]);
    });

    test('should return undefined for invalid object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.keys(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null', () => {
        const result = propertyHelpers.keys(null);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined', () => {
        const result = propertyHelpers.keys(undefined);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for array', () => {
        const obj = [{ '@type': 'Person', '@id': '123', name: 'John' }];
        const result = propertyHelpers.keys(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return sorted properties', () => {
        const obj = { '@type': 'Person', '@id': '123', zebra: 'z', apple: 'a', banana: 'b' };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual(['apple', 'banana', 'zebra']);
    });
});
