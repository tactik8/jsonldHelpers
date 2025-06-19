
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getRecordId', () => {
    test('should return id of valid JSON-LD object', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.id.get(obj);
        
        expect(result).toBe('123');
    });

    test('should return array id if @id is array', () => {
        const obj = { '@type': 'Person', '@id': ['123', '456'], name: 'John' };
        const result = propertyHelpers.id.get(obj);
        
        expect(result).toEqual(['123', '456']);
    });

    test('should return undefined for invalid object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.id.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null', () => {
        const result = propertyHelpers.id.get(null);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined', () => {
        const result = propertyHelpers.id.get(undefined);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for array', () => {
        const obj = [{ '@type': 'Person', '@id': '123' }];
        const result = propertyHelpers.id.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return null if @id is null', () => {
        const obj = { '@type': 'Person', '@id': null };
        const result = propertyHelpers.id.get(obj);
        
        expect(result).toBe(null);
    });

    test('should return undefined if @id is missing', () => {
        const obj = { '@type': 'Person', name: 'John' };
        const result = propertyHelpers.id.get(obj);
        
        expect(result).toBeUndefined();
    });
});
