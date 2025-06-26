
import { propertyHelpers as p } from '../../src/propertyHelpers.js';

describe('getProperties', () => {
  const validPerson = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 30,
    'email': 'john@example.com'
  };

  const organization = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    '@id': 'org-456',
    'legalName': 'Tech Corp',
    'foundingDate': '2020-01-01',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Main St',
      'addressLocality': 'New York'
    }
  };

  test('should return sorted properties excluding JSON-LD keywords', () => {
    const result = p.keys(validPerson);
    expect(result).toEqual(['age', 'email', 'name']);
  });

  test('should return sorted properties for organization', () => {
    const result = p.keys(organization);
    expect(result).toEqual(['address', 'foundingDate', 'legalName']);
  });

  test('should return empty array for object with only JSON-LD keywords', () => {
    const minimalObject = {
      '@context': 'https://schema.org/',
      '@type': 'Thing',
      '@id': 'thing-1'
    };
    const result = p.keys(minimalObject);
    expect(result).toEqual([]);
  });

  test('should return undefined for null', () => {
    expect(p.keys(null)).toBeUndefined();
  });

  test('should return undefined for undefined', () => {
    expect(p.keys(undefined)).toBeUndefined();
  });

  test('should return undefined for invalid objects', () => {
    expect(p.keys('string')).toBeUndefined();
    expect(p.keys(123)).toBeUndefined();
    expect(p.keys([])).toBeUndefined();
    expect(p.keys(true)).toBeUndefined();
  });

  test('should handle empty object', () => {
    expect(p.keys({})).toEqual([]);
  });

  test('should handle nested JSON-LD objects', () => {
    const nestedPerson = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'person-789',
      'name': 'Jane Doe',
      'worksFor': {
        '@type': 'Organization',
        '@id': 'org-123',
        'name': 'Company Inc'
      }
    };
    const result = p.keys(nestedPerson);
    expect(result).toEqual(['name', 'worksFor']);
  });
});
