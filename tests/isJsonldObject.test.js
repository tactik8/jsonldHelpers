
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('isJsonldObject', () => {
    test('should return true for valid JSON-LD object', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = objectHelpers.isValid(obj);
        
        expect(result).toBe(true);
    });

    test('should return false for object without @type', () => {
        const obj = { '@id': '123', name: 'John' };
        const result = objectHelpers.isValid(obj);
        
        expect(result).toBe(false);
    });

    test('should return false for object without @id', () => {
        const obj = { '@type': 'Person', name: 'John' };
        const result = objectHelpers.isValid(obj);
        
        expect(result).toBe(false);
    });

    test('should return false for object with null @type', () => {
        const obj = { '@type': null, '@id': '123', name: 'John' };
        const result = objectHelpers.isValid(obj);
        
        expect(result).toBe(false);
    });

    test('should return false for object with null @id', () => {
        const obj = { '@type': 'Person', '@id': null, name: 'John' };
        const result = objectHelpers.isValid(obj);
        
        expect(result).toBe(false);
    });

    test('should return false for null input', () => {
        const result = objectHelpers.isValid(null);
        expect(result).toBe(false);
    });

    test('should return false for undefined input', () => {
        const result = objectHelpers.isValid(undefined);
        expect(result).toBe(false);
    });

    test('should return false for primitive values', () => {
        expect(objectHelpers.isValid('string')).toBe(false);
        expect(objectHelpers.isValid(123)).toBe(false);
        expect(objectHelpers.isValid(true)).toBe(false);
    });

    test('should return false for array', () => {
        const arr = [{ '@type': 'Person', '@id': '123' }];
        const result = objectHelpers.isValid(arr);
        
        expect(result).toBe(false);
    });

    test('should return true for object with empty string @type and @id', () => {
        const obj = { '@type': '', '@id': '', name: 'John' };
        const result = objectHelpers.isValid(obj);
        
        expect(result).toBe(true);
    });
});
