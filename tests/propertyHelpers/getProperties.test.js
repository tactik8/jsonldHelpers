
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getProperties', () => {
    test('should return properties excluding JSON-LD keywords', () => {
        const obj = {
            '@context': 'https://schema.org/',
            '@type': 'Person',
            '@id': '123',
            name: 'John',
            age: 30,
            city: 'NYC'
        };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual(['age', 'city', 'name']);
    });

    test('should return empty array for object with only JSON-LD keywords', () => {
        const obj = {
            '@context': 'https://schema.org/',
            '@type': 'Person',
            '@id': '123'
        };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual([]);
    });

    test('should return sorted properties', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            zebra: 'animal',
            apple: 'fruit',
            banana: 'fruit'
        };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual(['apple', 'banana', 'zebra']);
    });

    test('should return undefined for invalid JSON-LD object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.keys(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null input', () => {
        const result = propertyHelpers.keys(null);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined input', () => {
        const result = propertyHelpers.keys(undefined);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for non-object input', () => {
        expect(propertyHelpers.keys('string')).toBeUndefined();
        expect(propertyHelpers.keys(123)).toBeUndefined();
        expect(propertyHelpers.keys(true)).toBeUndefined();
    });

    test('should return undefined for array input', () => {
        const arr = [{ '@type': 'Person', '@id': '123', name: 'John' }];
        const result = propertyHelpers.keys(arr);
        
        expect(result).toBeUndefined();
    });

    test('should handle object with empty string properties', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            '': 'empty key',
            name: 'John'
        };
        const result = propertyHelpers.keys(obj);
        
        expect(result).toEqual(['', 'name']);
    });
});
