
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('addValue', () => {
    test('should add value to new property', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.value.add(obj, 'skills', 'JavaScript');
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['JavaScript']);
    });

    test('should add value to existing array property', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript'] };
        const result = propertyHelpers.value.add(obj, 'skills', 'Python');
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['JavaScript', 'Python']);
    });

    test('should add value to existing single value property', () => {
        const obj = { '@type': 'Person', '@id': '123', skill: 'JavaScript' };
        const result = propertyHelpers.value.add(obj, 'skill', 'Python');
        
        expect(result).toBe(true);
        expect(obj.skill).toEqual(['JavaScript', 'Python']);
    });

    test('should add array of values', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript'] };
        const result = propertyHelpers.value.add(obj, 'skills', ['Python', 'Java']);
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['JavaScript', 'Python', 'Java']);
    });

    test('should not add duplicate values when noDuplicates is true', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript', 'Python'] };
        const result = propertyHelpers.value.add(obj, 'skills', 'JavaScript', true);
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['Python', 'JavaScript']);
    });

    test('should add duplicate values when noDuplicates is false', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript', 'Python'] };
        const result = propertyHelpers.value.add(obj, 'skills', 'JavaScript', false);
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['JavaScript', 'Python', 'JavaScript']);
    });

    test('should add duplicate values by default', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript', 'Python'] };
        const result = propertyHelpers.value.add(obj, 'skills', 'JavaScript');
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['JavaScript', 'Python', 'JavaScript']);
    });

    test('should handle adding to empty array', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: [] };
        const result = propertyHelpers.value.add(obj, 'skills', 'JavaScript');
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['JavaScript']);
    });

    test('should handle adding null value', () => {
        const obj = { '@type': 'Person', '@id': '123' };
        const result = propertyHelpers.value.add(obj, 'data', null);
        
        expect(result).toBe(true);
        expect(obj.data).toEqual([null]);
    });

    test('should handle adding undefined value', () => {
        const obj = { '@type': 'Person', '@id': '123' };
        const result = propertyHelpers.value.add(obj, 'data', undefined);
        
        expect(result).toBe(true);
        expect(obj.data).toEqual([undefined]);
    });

    test('should return false for invalid JSON-LD object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.value.add(obj, 'skills', 'JavaScript');
        
        expect(result).toBe(false);
    });

    test('should return false for null object', () => {
        const result = propertyHelpers.value.add(null, 'skills', 'JavaScript');
        
        expect(result).toBe(false);
    });

    test('should return false for undefined object', () => {
        const result = propertyHelpers.value.add(undefined, 'skills', 'JavaScript');
        
        expect(result).toBe(false);
    });

    test('should handle adding array with duplicates and noDuplicates true', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript'] };
        const result = propertyHelpers.value.add(obj, 'skills', ['JavaScript', 'Python', 'JavaScript'], true);
        
        expect(result).toBe(true);
        expect(obj.skills).toEqual(['Python', 'JavaScript', 'JavaScript']);
    });

    test('should handle nested path', () => {
        const obj = { '@type': 'Person', '@id': '123', details: {} };
        const result = propertyHelpers.value.add(obj, 'details.skills', 'JavaScript');
        
        expect(result).toBe(true);
        expect(obj.details.skills).toEqual(['JavaScript']);
    });
});
