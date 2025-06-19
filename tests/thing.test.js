
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('thing', () => {
    test('should create a basic Thing with default type', () => {
        const result = objectHelpers.new();
        
        expect(result).toHaveProperty('@context', 'https://schema.org/');
        expect(result).toHaveProperty('@type', 'Thing');
        expect(result).toHaveProperty('@id');
        expect(typeof result['@id']).toBe('string');
    });

    test('should create a Thing with custom type', () => {
        const result = objectHelpers.new('Person');
        
        expect(result).toHaveProperty('@context', 'https://schema.org/');
        expect(result).toHaveProperty('@type', 'Person');
        expect(result).toHaveProperty('@id');
    });

    test('should create a Thing with custom type and id', () => {
        const customId = 'custom-id-123';
        const result = objectHelpers.new('Organization', customId);
        
        expect(result).toHaveProperty('@context', 'https://schema.org/');
        expect(result).toHaveProperty('@type', 'Organization');
        expect(result).toHaveProperty('@id', customId);
    });

    test('should handle empty string type', () => {
        const result = objectHelpers.new('');
        
        expect(result).toHaveProperty('@type', '');
        expect(result).toHaveProperty('@id');
    });

    test('should handle null type', () => {
        const result = objectHelpers.new(null);
        
        expect(result).toHaveProperty('@type', null);
        expect(result).toHaveProperty('@id');
    });

    test('should handle undefined type', () => {
        const result = objectHelpers.new(undefined);
        
        expect(result).toHaveProperty('@type', 'Thing');
        expect(result).toHaveProperty('@id');
    });
});
