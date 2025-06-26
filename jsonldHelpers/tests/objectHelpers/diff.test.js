
import { objectHelpers as h } from '../../src/objectHelpers.js';

describe('diff', () => {
  const person1 = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 30,
    'email': 'john@example.com'
  };

  const person2 = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 25,
    'address': 'New York'
  };

  test('should return differences between objects', () => {
    const result = h.diff(person1, person2);
    expect(result.age).toEqual([30]);
    expect(result.email).toEqual(['john@example.com']);
    expect(result.address).toBeUndefined();
  });

  test('should return empty object for identical objects', () => {
    const result = h.diff(person1, person1);
    expect(Object.keys(result)).toHaveLength(0);
  });

  test('should handle undefined/null inputs', () => {
    expect(h.diff(undefined, person1)).toBeUndefined();
    expect(h.diff(person1, undefined)).toBe(person1);
    expect(h.diff(null, person1)).toBeNull();
    expect(h.diff(person1, null)).toBe(person1);
  });

  test('should return undefined for non-JSON-LD objects', () => {
    const nonJsonld = { name: 'John' };
    expect(h.diff(nonJsonld, person1)).toBeUndefined();
    expect(h.diff(person1, nonJsonld)).toBeUndefined();
  });

  test('should handle array values', () => {
    const obj1 = {
      '@type': 'Person',
      '@id': 'p1',
      'hobbies': ['reading', 'swimming', 'cooking']
    };
    const obj2 = {
      '@type': 'Person',
      '@id': 'p1',
      'hobbies': ['reading', 'gaming']
    };
    
    const result = h.diff(obj1, obj2);
    expect(result.hobbies).toEqual(['swimming', 'cooking']);
  });

  test('should handle objects with no overlapping properties', () => {
    const obj1 = {
      '@type': 'Person',
      '@id': 'p1',
      'name': 'John',
      'age': 30
    };
    const obj2 = {
      '@type': 'Person',
      '@id': 'p1',
      'email': 'john@example.com',
      'address': 'NYC'
    };
    
    const result = h.diff(obj1, obj2);
    expect(result.name).toEqual(['John']);
    expect(result.age).toEqual([30]);
    expect(result.email).toBeUndefined();
  });

  test('should handle empty objects', () => {
    const empty1 = { '@type': 'Person', '@id': 'p1' };
    const empty2 = { '@type': 'Person', '@id': 'p1' };
    
    const result = h.diff(empty1, empty2);
    expect(Object.keys(result)).toHaveLength(0);
  });
});
