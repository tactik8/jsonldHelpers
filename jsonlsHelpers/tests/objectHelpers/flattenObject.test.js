
import { objectHelpers } from '../../src/src/objectHelpers.js';

describe('flattenObject', () => {
    test('should return null/undefined as is', () => {
        expect(objectHelpers.flatten(null)).toBe(null);
        expect(objectHelpers.flatten(undefined)).toBe(undefined);
    });

    test('should return non-object primitives as is', () => {
        expect(objectHelpers.flatten('string')).toBe('string');
        expect(objectHelpers.flatten(123)).toBe(123);
        expect(objectHelpers.flatten(true)).toBe(true);
    });

    test('should flatten simple object without nested records', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = objectHelpers.flatten(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(obj);
    });

    test('should flatten object with nested records', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            name: 'John',
            address: {
                '@type': 'PostalAddress',
                '@id': '456',
                street: '123 Main St',
                city: 'NYC'
            }
        };
        const result = objectHelpers.flatten(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        
        // Check that nested object is replaced with reference
        const mainRecord = result.find(r => r['@id'] === '123');
        expect(mainRecord.address).toEqual({
            '@type': 'PostalAddress',
            '@id': '456'
        });
        
        // Check that nested record is included
        const nestedRecord = result.find(r => r['@id'] === '456');
        expect(nestedRecord).toEqual({
            '@type': 'PostalAddress',
            '@id': '456',
            street: '123 Main St',
            city: 'NYC'
        });
    });

    test('should handle arrays of objects', () => {
        const arr = [
            { '@type': 'Person', '@id': '123', name: 'John' },
            { '@type': 'Person', '@id': '456', name: 'Jane' }
        ];
        const result = objectHelpers.flatten(arr);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0]['@id']).toBe('123');
        expect(result[1]['@id']).toBe('456');
    });

    test('should handle deeply nested structures', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            name: 'John',
            address: {
                '@type': 'PostalAddress',
                '@id': '456',
                country: {
                    '@type': 'Country',
                    '@id': '789',
                    name: 'USA'
                }
            }
        };
        const result = objectHelpers.flatten(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
        
        const ids = result.map(r => r['@id']).sort();
        expect(ids).toEqual(['123', '456', '789']);
    });

    test('should handle arrays with nested objects', () => {
        const arr = [
            {
                '@type': 'Person',
                '@id': '123',
                address: {
                    '@type': 'PostalAddress',
                    '@id': '456',
                    street: '123 Main St'
                }
            }
        ];
        const result = objectHelpers.flatten(arr);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
    });

    test('should filter out undefined and empty values', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            name: 'John',
            emptyField: undefined,
            nullField: null
        };
        const result = objectHelpers.flatten(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', 'John');
    });
});
