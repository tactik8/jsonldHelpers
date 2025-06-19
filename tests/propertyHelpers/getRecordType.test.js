
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('getRecordType', () => {
    test('should return type of valid JSON-LD object', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.type.get(obj);
        
        expect(result).toBe('Person');
    });

    test('should return array type if @type is array', () => {
        const obj = { '@type': ['Person', 'Agent'], '@id': '123', name: 'John' };
        const result = propertyHelpers.type.get(obj);
        
        expect(result).toEqual(['Person', 'Agent']);
    });

    test('should return undefined for invalid object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.type.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null', () => {
        const result = propertyHelpers.type.get(null);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined', () => {
        const result = propertyHelpers.type.get(undefined);
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for array', () => {
        const obj = [{ '@type': 'Person', '@id': '123' }];
        const result = propertyHelpers.type.get(obj);
        
        expect(result).toBeUndefined();
    });

    test('should return null if @type is null', () => {
        const obj = { '@type': null, '@id': '123' };
        const result = propertyHelpers.type.get(obj);
        
        expect(result).toBeUndefined();
    });
});
