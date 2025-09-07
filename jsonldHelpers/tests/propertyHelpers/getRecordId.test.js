
import { PropertyHelpers as p } from '../../src/propertyHelpers/propertyHelpers.models.js';

describe('getRecordId', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe'
  };

  const organization = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    '@id': 'https://example.com/org/456',
    'legalName': 'Tech Corp'
  };

  const multipleIds = {
    '@context': 'https://schema.org/',
    '@type': 'Thing',
    '@id': ['id-1', 'id-2'],
    'name': 'Multi ID Thing'
  };

  test('should return id for valid JSON-LD object', () => {
    expect(p.id.get(person)).toBe('person-123');
    expect(p.id.get(organization)).toBe('https://example.com/org/456');
  });

  test('should return first id for multiple ids', () => {
    expect(p.id.get(multipleIds)).toEqual('id-1');
  });

  test('should return undefined for object without @id', () => {
    const noId = {
      '@context': 'https://schema.org/',
      '@type': 'Thing',
      'name': 'Something'
    };
    expect(p.id.get(noId)).toBeUndefined();
  });

  test('should return undefined for null', () => {
    expect(p.id.get(null)).toBeUndefined();
  });

  test('should return undefined for undefined', () => {
    expect(p.id.get(undefined)).toBeUndefined();
  });

  test('should return undefined for invalid objects', () => {
    expect(p.id.get('string')).toBeUndefined();
    expect(p.id.get(123)).toBeUndefined();
    expect(p.id.get([])).toBeUndefined();
    expect(p.id.get(true)).toBeUndefined();
  });

  test('should return undefined for empty object', () => {
    expect(p.id.get({})).toBeUndefined();
  });

  test('should handle nested objects', () => {
    const nested = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'person-nested',
      'address': {
        '@type': 'PostalAddress',
        '@id': 'address-123',
        'streetAddress': '123 Main St'
      }
    };
    expect(p.id.get(nested)).toBe('person-nested');
    expect(p.id.get(nested.address)).toBe('address-123');
  });

  test('should handle numeric IDs', () => {
    const numericId = {
      '@type': 'Thing',
      '@id': 12345,
      'name': 'Numeric ID'
    };
    expect(p.id.get(numericId)).toBe(12345);
  });
});
