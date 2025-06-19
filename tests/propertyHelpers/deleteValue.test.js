
import { propertyHelpers } from '../../src/src/propertyHelpers.js';

describe('deleteValue', () => {
    test('should delete value from array property', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript', 'Python', 'Java'] };
        const result = propertyHelpers.value.delete(obj, 'skills', 'Python');
        
        expect(result).toEqual(obj);
        expect(obj.skills).toEqual(['JavaScript', 'Java']);
    });

    test('should delete value from single value property', () => {
        const obj = { '@type': 'Person', '@id': '123', skill: 'JavaScript' };
        const result = propertyHelpers.value.delete(obj, 'skill', 'JavaScript');
        
        expect(result).toEqual(obj);
        expect(obj.skill).toEqual([]);
    });

    test('should not delete non-matching value', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript', 'Python'] };
        const originalSkills = [...obj.skills];
        const result = propertyHelpers.value.delete(obj, 'skills', 'Java');
        
        expect(result).toEqual(obj);
        expect(obj.skills).toEqual(originalSkills);
    });

    test('should delete all matching values', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: ['JavaScript', 'Python', 'JavaScript'] };
        const result = propertyHelpers.value.delete(obj, 'skills', 'JavaScript');
        
        expect(result).toEqual(obj);
        expect(obj.skills).toEqual(['Python']);
    });

    test('should handle deleting from empty array', () => {
        const obj = { '@type': 'Person', '@id': '123', skills: [] };
        const result = propertyHelpers.value.delete(obj, 'skills', 'JavaScript');
        
        expect(result).toEqual(obj);
        expect(obj.skills).toEqual([]);
    });

    test('should handle deleting from non-existent property', () => {
        const obj = { '@type': 'Person', '@id': '123', name: 'John' };
        const result = propertyHelpers.value.delete(obj, 'skills', 'JavaScript');
        
        expect(result).toEqual(obj);
        expect(obj.skills).toEqual([]);
    });

    test('should handle deleting null value', () => {
        const obj = { '@type': 'Person', '@id': '123', data: [null, 'value', null] };
        const result = propertyHelpers.value.delete(obj, 'data', null);
        
        expect(result).toEqual(obj);
        expect(obj.data).toEqual(['value']);
    });

    test('should handle deleting undefined value', () => {
        const obj = { '@type': 'Person', '@id': '123', data: [undefined, 'value', undefined] };
        const result = propertyHelpers.value.delete(obj, 'data', undefined);
        
        expect(result).toEqual(obj);
        expect(obj.data).toEqual(['value']);
    });

    test('should handle deleting object values', () => {
        const targetObj = { id: 1, name: 'test' };
        const obj = { 
            '@type': 'Person', 
            '@id': '123', 
            items: [
                { id: 1, name: 'test' },
                { id: 2, name: 'other' },
                { id: 1, name: 'test' }
            ]
        };
        const result = propertyHelpers.value.delete(obj, 'items', targetObj);
        
        expect(result).toEqual(obj);
        expect(obj.items).toHaveLength(1);
        expect(obj.items[0]).toEqual({ id: 2, name: 'other' });
    });

    test('should return undefined for invalid JSON-LD object', () => {
        const obj = { name: 'John' }; // missing @type
        const result = propertyHelpers.value.delete(obj, 'skills', 'JavaScript');
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for null object', () => {
        const result = propertyHelpers.value.delete(null, 'skills', 'JavaScript');
        
        expect(result).toBeUndefined();
    });

    test('should return undefined for undefined object', () => {
        const result = propertyHelpers.value.delete(undefined, 'skills', 'JavaScript');
        
        expect(result).toBeUndefined();
    });

    test('should handle deleting from nested path', () => {
        const obj = { 
            '@type': 'Person', 
            '@id': '123', 
            details: { 
                skills: ['JavaScript', 'Python'] 
            } 
        };
        const result = propertyHelpers.value.delete(obj, 'details.skills', 'Python');
        
        expect(result).toEqual(obj);
        expect(obj.details.skills).toEqual(['JavaScript']);
    });

    test('should delete entire property when only value is removed', () => {
        const obj = { '@type': 'Person', '@id': '123', onlySkill: 'JavaScript' };
        const result = propertyHelpers.value.delete(obj, 'onlySkill', 'JavaScript');
        
        expect(result).toEqual(obj);
        expect(obj.onlySkill).toEqual([]);
    });
});
