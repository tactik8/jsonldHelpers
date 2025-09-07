
import { PropertyHelpers as p } from '../../src/propertyHelpers/propertyHelpers.models.js';

describe('getRecordType', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe'
  };

  const organization = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    '@id': 'org-456',
    'legalName': 'Tech Corp'
  };

  const multipleTypes = {
    '@context': 'https://schema.org/',
    '@type': ['Person', 'Employee'],
    '@id': 'person-employee-789',
    'name': 'Jane Smith'
  };

  test('should return type for valid JSON-LD object', () => {
    expect(p.type.get(person)).toBe('Person');
    expect(p.type.get(organization)).toBe('Organization');
  });

  test('should return first type for multiple types', () => {
    expect(p.type.get(multipleTypes)).toEqual('Person');
  });

  test('should return undefined for object without @type', () => {
    const noType = {
      '@context': 'https://schema.org/',
      '@id': 'thing-123',
      'name': 'Something'
    };
    expect(p.type.get(noType)).toBeUndefined();
  });

  test('should return undefined for null', () => {
    expect(p.type.get(null)).toBeUndefined();
  });

  test('should return undefined for undefined', () => {
    expect(p.type.get(undefined)).toBeUndefined();
  });

  test('should return undefined for invalid objects', () => {
    expect(p.type.get('string')).toBeUndefined();
    expect(p.type.get(123)).toBeUndefined();
    expect(p.type.get([])).toBeUndefined();
    expect(p.type.get(true)).toBeUndefined();
  });

  test('should return undefined for empty object', () => {
    expect(p.type.get({})).toBeUndefined();
  });

  test('should handle nested objects', () => {
    const nested = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'person-nested',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '123 Main St'
      }
    };
    expect(p.type.get(nested)).toBe('Person');
    expect(p.type.get(nested.address)).toBe('PostalAddress');
  });
});
