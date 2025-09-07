
import { PropertyHelpers as p } from '../../src/propertyHelpers/propertyHelpers.models.js';

describe('getValues', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 30,
    'hobbies': ['reading', 'swimming', 'cycling'],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Main St',
      'addressLocality': 'New York'
    },
    'children': [
      {
        '@type': 'Person',
        '@id': 'child-1',
        'name': 'Jane Doe'
      },
      {
        '@type': 'Person',
        '@id': 'child-2',
        'name': 'Bob Doe'
      }
    ]
  };

  test('should get array of values for array properties', () => {
    expect(p.values.get(person, 'hobbies')).toEqual(['reading', 'swimming', 'cycling']);
    expect(p.values.get(person, 'children')).toEqual(person.children);
  });

  test('should wrap single values in array', () => {
    expect(p.values.get(person, 'name')).toEqual(['John Doe']);
    expect(p.values.get(person, 'age')).toEqual([30]);
    expect(p.values.get(person, '@type')).toEqual(['Person']);
  });

  test('should get nested property values', () => {
    expect(p.values.get(person, 'address.streetAddress')).toEqual(['123 Main St']);
    expect(p.values.get(person, 'address.addressLocality')).toEqual(['New York']);
  });

  test('should get array element by index', () => {
    expect(p.values.get(person, 'hobbies[0]')).toEqual(['reading']);
    expect(p.values.get(person, 'hobbies[1]')).toEqual(['swimming']);
    expect(p.values.get(person, 'children[0].name')).toEqual(['Jane Doe']);
  });

  test('should return undefined for non-existent properties', () => {
    expect(p.values.get(person, 'nonexistent')).toEqual([]);
    expect(p.values.get(person, 'address.nonexistent')).toEqual([]);
    expect(p.values.get(person, 'hobbies[5]')).toEqual([]);
  });

  test('should return default value when provided', () => {
    expect(p.values.get(person, 'nonexistent', ['default'])).toEqual(['default']);
    expect(p.values.get(person, 'address.nonexistent', 'N/A')).toEqual(['N/A']);
  });

  test('should handle null and undefined objects', () => {
    expect(p.values.get(null, 'name')).toBeUndefined();
    expect(p.values.get(undefined, 'name')).toBeUndefined();
    expect(p.values.get(null, 'name', 'default')).toBe('default');
  });

  test('should handle invalid path types', () => {
    expect(p.values.get(person, null)).toBeUndefined();
    expect(p.values.get(person, undefined)).toBeUndefined();
    expect(p.values.get(person, '')).toBe(person)
    expect(p.values.get(person, 123)).toBeUndefined();
  });

  test('should handle complex nested array paths', () => {
    const complex = {
      'departments': [
        {
          'employees': [
            { 'name': 'Alice', 'skills': ['JS', 'Python'] },
            { 'name': 'Bob', 'skills': ['Java', 'C++'] }
          ]
        }
      ]
    };
    expect(p.values.get(complex, 'departments[0].employees[0].skills')).toEqual(['JS', 'Python']);
    expect(p.values.get(complex, 'departments[0].employees[1].name')).toEqual(['Bob']);
  });

  test('should handle edge cases with arrays', () => {
    expect(p.values.get(person, 'children[10].name')).toEqual([])
    expect(p.values.get(person, 'children[-1].name')).toEqual([])
  });

  test('should handle empty arrays', () => {
    const emptyArray = { 'items': [] };
    expect(p.values.get(emptyArray, 'items')).toEqual([]);
  });

  test('should return object itself for empty path', () => {
    expect(p.values.get(person, '')).toBe(person);
  });
});
