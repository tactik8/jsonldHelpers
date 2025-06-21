
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('setID', () => {
    test('should add ID to valid JSON-LD object without ID', () => {
        const obj = { '@type': 'Person', '@context': 'https://schema.org/', name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toHaveProperty('@id');
        expect(typeof result['@id']).toBe('string');
        expect(result['@id']).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        expect(result).toHaveProperty('@type', 'Person');
        expect(result).toHaveProperty('name', 'John');
    });

    test('should preserve existing ID in valid JSON-LD object', () => {
        const existingId = 'existing-id-123';
        const obj = { '@type': 'Person', '@id': existingId, name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toHaveProperty('@id', existingId);
        expect(result).toHaveProperty('@type', 'Person');
        expect(result).toHaveProperty('name', 'John');
    });

    test('should replace null ID with generated UUID', () => {
        const obj = { '@type': 'Person', '@id': null, name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toHaveProperty('@id');
        expect(result['@id']).not.toBeNull();
        expect(typeof result['@id']).toBe('string');
        expect(result['@id']).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    test('should handle array of objects', () => {
        const arr = [
            { '@type': 'Person', name: 'John' },
            { '@type': 'Person', '@id': 'existing-123', name: 'Jane' },
            { '@type': 'Organization', '@id': null, name: 'Acme Corp' }
        ];
        const result = objectHelpers.setID(arr);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
        
        // First object should get new ID
        expect(result[0]).toHaveProperty('@id');
        expect(typeof result[0]['@id']).toBe('string');
        
        // Second object should keep existing ID
        expect(result[1]).toHaveProperty('@id', 'existing-123');
        
        // Third object should get new ID (null replaced)
        expect(result[2]).toHaveProperty('@id');
        expect(result[2]['@id']).not.toBeNull();
    });

    test('should handle empty array', () => {
        const result = objectHelpers.setID([]);
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(0);
    });

    test('should throw error for invalid object without @type', () => {
        const obj = { name: 'John' }; // missing @type
        
        expect(() => {
            objectHelpers.setID(obj);
        }).toThrow('Invalid object');
    });

    test('should throw error for invalid object without @type and @id', () => {
        const obj = { name: 'John', age: 30 };
        
        expect(() => {
            objectHelpers.setID(obj);
        }).toThrow('Invalid object');
    });

    test('should return defaultValue for invalid object when provided', () => {
        const obj = { name: 'John' }; // missing @type
        const defaultValue = 'default-value';
        const result = objectHelpers.setID(obj, defaultValue);
        
        expect(result).toBe(defaultValue);
    });

    test('should handle null input with defaultValue', () => {
        const result = objectHelpers.setID(null, 'default');
        
        expect(result).toBe('default');
    });

    test('should handle undefined input with defaultValue', () => {
        const result = objectHelpers.setID(undefined, 'default');
        
        expect(result).toBe('default');
    });

    test('should throw error for null input without defaultValue', () => {
        expect(() => {
            objectHelpers.setID(null);
        }).toThrow('Invalid object');
    });

    test('should throw error for undefined input without defaultValue', () => {
        expect(() => {
            objectHelpers.setID(undefined);
        }).toThrow('Invalid object');
    });

    test('should handle primitive values with defaultValue', () => {
        const result = objectHelpers.setID('string', 'default');
        
        expect(result).toBe('default');
    });

    test('should throw error for primitive values without defaultValue', () => {
        expect(() => {
            objectHelpers.setID('string');
        }).toThrow('Invalid object');
        
        expect(() => {
            objectHelpers.setID(123);
        }).toThrow('Invalid object');
        
        expect(() => {
            objectHelpers.setID(true);
        }).toThrow('Invalid object');
    });

    test('should handle array with mix of valid and invalid objects', () => {
        const arr = [
            { '@type': 'Person', name: 'John' }, // valid
            { name: 'Invalid' }, // invalid
            { '@type': 'Organization', '@id': 'org-123' } // valid
        ];
        
        expect(() => {
            objectHelpers.setID(arr);
        }).toThrow('Invalid object');
    });

    test('should handle array with mix of valid and invalid objects with defaultValue', () => {
        const arr = [
            { '@type': 'Person', name: 'John' }, // valid
            { name: 'Invalid' }, // invalid
            { '@type': 'Organization', '@id': 'org-123' } // valid
        ];
        const result = objectHelpers.setID(arr, 'default');
        
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);
        
        // First object should get new ID
        expect(result[0]).toHaveProperty('@id');
        expect(typeof result[0]['@id']).toBe('string');
        
        // Second object should be replaced with default value
        expect(result[1]).toBe('default');
        
        // Third object should keep existing ID
        expect(result[2]).toHaveProperty('@id', 'org-123');
    });

    test('should handle object with empty string @type', () => {
        const obj = { '@type': '', '@id': null, name: 'John' };
        
        expect(() => {
            objectHelpers.setID(obj);
        }).toThrow('Invalid object');
    });

    test('should handle object with empty string @id', () => {
        const obj = { '@type': 'Person', '@id': '', name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toHaveProperty('@id');
        expect(result['@id']).not.toBe('');
        expect(typeof result['@id']).toBe('string');
        expect(result['@id']).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    test('should modify original object (not create copy)', () => {
        const obj = { '@type': 'Person', name: 'John' };
        const result = objectHelpers.setID(obj);
        
        expect(result).toBe(obj); // Same reference
        expect(obj).toHaveProperty('@id'); // Original object is modified
    });

    test('should generate different UUIDs for multiple calls', () => {
        const obj1 = { '@type': 'Person', name: 'John' };
        const obj2 = { '@type': 'Person', name: 'Jane' };
        
        const result1 = objectHelpers.setID(obj1);
        const result2 = objectHelpers.setID(obj2);
        
        expect(result1['@id']).not.toBe(result2['@id']);
    });

    test('should handle deeply nested array', () => {
        const arr = [
            [
                { '@type': 'Person', name: 'John' },
                { '@type': 'Person', '@id': 'existing', name: 'Jane' }
            ]
        ];
        const result = objectHelpers.setID(arr);
        
        expect(Array.isArray(result)).toBe(true);
        expect(Array.isArray(result[0])).toBe(true);
        expect(result[0][0]).toHaveProperty('@id');
        expect(result[0][1]).toHaveProperty('@id', 'existing');
    });
});
