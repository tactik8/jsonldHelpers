
import { objectHelpers } from '../../src/src/objectHelpers.js';

describe('getRef', () => {
    test('should return reference object for valid JSON-LD object', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = objectHelpers.ref.get(obj);
        
        expect(result).toEqual({
            '@type': 'Person',
            '@id': '123'
        });
    });

    test('should return undefined for object without @type', () => {
        const obj = { '@id': '123', name: 'John' };
        const result = objectHelpers.ref.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for object without @id', () => {
        const obj = { '@type': 'Person', name: 'John' };
        const result = objectHelpers.ref.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should handle array of objects', () => {
        const arr = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { '@type': 'Person', '@id': '456', name: 'Jane' }
        ];
        const result = objectHelpers.ref.get(arr);
        
        expect(result).toEqual([
            { '@type': 'Person', '@id': '123' },
            { '@type': 'Person', '@id': '456' }
        ]);
    });

    test('should handle mixed array with invalid objects', () => {
        const arr = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { name: 'Invalid' }
        ];
        const result = objectHelpers.ref.get(arr);
        
        expect(result).toEqual([
            { '@type': 'Person', '@id': '123' },
            undefined
        ]);
    });

    test('should return undefined for null @type', () => {
        const obj = { '@type': null, '@id': '123', name: 'John' };
        const result = objectHelpers.ref.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null @id', () => {
        const obj = { '@type': 'Person', '@id': null, name: 'John' };
        const result = objectHelpers.ref.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should handle empty array', () => {
        const result = objectHelpers.ref.get([]);
        expect(result).toEqual([]);
    });

    test('should handle null input', () => {
        const result = objectHelpers.ref.get(null);
        expect(result).toBeUndefined();
    });
});
