
import { objectHelpers as h } from '../../src/objectHelpers.js';

describe('setID', () => {
  test('should set ID for valid object without ID', () => {
    const obj = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      'name': 'John Doe'
    };
    const result = h.setID(obj);
    expect(result['@id']).toBeDefined();
    expect(typeof result['@id']).toBe('string');
  });

  test('should preserve existing ID', () => {
    const obj = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'existing-id',
      'name': 'John Doe'
    };
    const result = h.setID(obj);
    expect(result['@id']).toBe('existing-id');
  });

  test('should handle array of objects', () => {
    const objects = [
      { '@type': 'Person', 'name': 'John' },
      { '@type': 'Person', 'name': 'Jane', '@id': 'jane-123' }
    ];
    const result = h.setID(objects);
    expect(result[0]['@id']).toBeDefined();
    expect(result[1]['@id']).toBe('jane-123');
  });

  test('should throw error for invalid object', () => {
    expect(() => h.setID('invalid')).toThrow('Invalid object');
    expect(() => h.setID(123)).toThrow('Invalid object');
    expect(() => h.setID(null)).toThrow('Invalid object');
  });

  test('should return default value for invalid object', () => {
    const defaultValue = { '@type': 'Thing', '@id': 'default' };
    const result = h.setID('invalid', defaultValue);
    expect(result).toBe(defaultValue);
  });

  test('should replace null ID with generated ID', () => {
    const obj = {
      '@type': 'Person',
      '@id': null,
      'name': 'John'
    };
    const result = h.setID(obj);
    expect(result['@id']).toBeDefined();
    expect(result['@id']).not.toBeNull();
  });

  test('should handle empty array', () => {
    const result = h.setID([]);
    expect(result).toEqual([]);
  });
});
