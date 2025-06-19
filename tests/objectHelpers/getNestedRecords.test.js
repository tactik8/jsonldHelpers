
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('getNestedRecords', () => {
    test('should return empty array for null/undefined', () => {
        expect(objectHelpers.children.get(null)).toEqual([]);
        expect(objectHelpers.children.get(undefined)).toEqual([]);
    });

    test('should return empty array for primitive values', () => {
        expect(objectHelpers.children.get('string')).toEqual([]);
        expect(objectHelpers.children.get(123)).toEqual([]);
        expect(objectHelpers.children.get(true)).toEqual([]);
    });

    test('should find nested records in object', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            name: 'John',
            address: {
                '@type': 'PostalAddress',
                '@id': '456',
                street: '123 Main St'
            }
        };
        const result = objectHelpers.children.get(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            '@type': 'PostalAddress',
            '@id': '456',
            street: '123 Main St'
        });
    });

    test('should find multiple nested records', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            name: 'John',
            addresses: [
                {
                    '@type': 'PostalAddress',
                    '@id': '456',
                    street: '123 Main St'
                },
                {
                    '@type': 'PostalAddress',
                    '@id': '789',
                    street: '456 Oak Ave'
                }
            ]
        };
        const result = objectHelpers.children.get(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0]['@id']).toBe('456');
        expect(result[1]['@id']).toBe('789');
    });

    test('should handle deeply nested records', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
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
        const result = objectHelpers.children.get(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        
        const ids = result.map(r => r['@id']).sort();
        expect(ids).toEqual(['456', '789']);
    });

    test('should handle arrays of objects', () => {
        const arr = [
            {
                '@type': 'Person',
                '@id': '123',
                address: {
                    '@type': 'PostalAddress',
                    '@id': '456'
                }
            },
            {
                '@type': 'Person',
                '@id': '789',
                address: {
                    '@type': 'PostalAddress',
                    '@id': '101'
                }
            }
        ];
        const result = objectHelpers.children.get(arr);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(2);
        expect(result[0]['@id']).toBe('456');
        expect(result[1]['@id']).toBe('101');
    });

    test('should filter out undefined and null values', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            validAddress: {
                '@type': 'PostalAddress',
                '@id': '456'
            },
            invalidAddress: null,
            undefinedAddress: undefined
        };
        const result = objectHelpers.children.get(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]['@id']).toBe('456');
    });

    test('should set ID for objects without ID', () => {
        const obj = {
            '@type': 'Person',
            '@id': '123',
            address: {
                '@type': 'PostalAddress',
                street: '123 Main St'
            }
        };
        const result = objectHelpers.children.get(obj);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('@id');
        expect(typeof result[0]['@id']).toBe('string');
    });

    test('should handle empty arrays', () => {
        const result = objectHelpers.children.get([]);
        expect(result).toEqual([]);
    });
});
