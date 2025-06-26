
import { propertyHelpers as p } from '../../src/propertyHelpers.js';

describe('getValue', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 30,
    'hobbies': ['reading', 'swimming'],
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Main St',
      'addressLocality': 'New York',
      'addressRegion': 'NY'
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

  test('should get simple property value', () => {
    expect(p.value.get(person, 'name')).toBe('John Doe');
    expect(p.value.get(person, 'age')).toBe(30);
    expect(p.value.get(person, '@type')).toBe('Person');
    expect(p.value.get(person, '@id')).toBe('person-123');
  });

  test('should get first value from array', () => {
    expect(p.value.get(person, 'hobbies')).toBe('reading');
  });

  test('should get nested property value', () => {
    expect(p.value.get(person, 'address.streetAddress')).toBe('123 Main St');
    expect(p.value.get(person, 'address.addressLocality')).toBe('New York');
    expect(p.value.get(person, 'address.@type')).toBe('PostalAddress');
  });

  test('should get array element by index', () => {
    expect(p.value.get(person, 'hobbies[0]')).toBe('reading');
    expect(p.value.get(person, 'hobbies[1]')).toBe('swimming');
    expect(p.value.get(person, 'children[0].name')).toBe('Jane Doe');
    expect(p.value.get(person, 'children[1].@id')).toBe('child-2');
  });

  test('should return undefined for non-existent properties', () => {
    expect(p.value.get(person, 'nonexistent')).toBeUndefined();
    expect(p.value.get(person, 'address.nonexistent')).toBeUndefined();
    expect(p.value.get(person, 'hobbies[5]')).toBeUndefined();
  });

  test('should return default value when provided', () => {
    expect(p.value.get(person, 'nonexistent', 'default')).toBe('default');
    expect(p.value.get(person, 'address.nonexistent', 'N/A')).toBe('N/A');
  });

  test('should handle null and undefined objects', () => {
    expect(p.value.get(null, 'name')).toBeUndefined();
    expect(p.value.get(undefined, 'name')).toBeUndefined();
    expect(p.value.get(null, 'name', 'default')).toBe('default');
  });

  test('should handle invalid path types', () => {
    expect(p.value.get(person, null)).toBe(person);
    expect(p.value.get(person, undefined)).toBe(person);
    expect(p.value.get(person, '')).toBe(person);
    expect(p.value.get(person, 123)).toBeUndefined();
  });

  test('should handle complex nested paths', () => {
    const complex = {
      'data': {
        'users': [
          {
            'profile': {
              'settings': {
                'theme': 'dark'
              }
            }
          }
        ]
      }
    };
    expect(p.value.get(complex, 'data.users[0].profile.settings.theme')).toBe('dark');
  });

  test('should handle edge cases with arrays', () => {
    expect(p.value.get(person, 'children[10].name')).toBeUndefined();
    expect(p.value.get(person, 'children[-1].name')).toBeUndefined();
  });

  test('should handle empty path', () => {
    expect(p.value.get(person, '')).toBe(person);
  });
});
