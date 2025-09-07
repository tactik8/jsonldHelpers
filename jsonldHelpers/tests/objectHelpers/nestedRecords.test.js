
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('nested record functions', () => {
  const address = {
    '@context': 'https://schema.org/',
    '@type': 'PostalAddress',
    '@id': 'address-123',
    'streetAddress': '123 Main St',
    'addressLocality': 'Anytown',
    'postalCode': '12345'
  };

  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'address': address,
    'workAddress': {
      '@type': 'PostalAddress',
      '@id': 'work-address-456',
      'streetAddress': '456 Business Ave'
    }
  };

  describe('getNestedRecords', () => {
    test('should extract nested records', () => {
      const nested = h.children.get(person);
      expect(nested).toHaveLength(2);
      expect(nested[0]['@type']).toBe('PostalAddress');
      expect(nested[0]['@id']).toBe('address-123');
      expect(nested[1]['@type']).toBe('PostalAddress');
      expect(nested[1]['@id']).toBe('work-address-456');
    });

    test('should handle arrays of nested objects', () => {
      const personWithMultipleAddresses = {
        '@type': 'Person',
        '@id': 'person-123',
        'addresses': [address, { '@type': 'PostalAddress', '@id': 'addr2' }]
      };
      
      const nested = h.children.get(personWithMultipleAddresses);
      expect(nested).toHaveLength(2);
    });

    test('should return empty array for no nested records', () => {
      const simplePerson = {
        '@type': 'Person',
        '@id': 'person-123',
        'name': 'John Doe'
      };
      
      const nested = h.children.get(simplePerson);
      expect(nested).toEqual([]);
    });

    test('should handle null/undefined', () => {
      expect(h.children.get(null)).toEqual([]);
      expect(h.children.get(undefined)).toEqual([]);
    });

    test('should handle non-objects', () => {
      expect(h.children.get('string')).toEqual([]);
      expect(h.children.get(123)).toEqual([]);
    });

    test('should handle arrays', () => {
      const people = [person, { '@type': 'Person', '@id': 'p2', 'name': 'Jane' }];
      const nested = h.children.get(people);
      expect(nested).toHaveLength(2); // Only address records
    });
  });

  describe('changeNestedRecordsToRef', () => {
    test('should convert nested objects to references', () => {
      const result = h.children.toRefs(person);
      expect(result.address).toEqual({
        '@type': 'PostalAddress',
        '@id': 'address-123'
      });
      expect(result.workAddress).toEqual({
        '@type': 'PostalAddress',
        '@id': 'work-address-456'
      });
      expect(result.name).toBe('John Doe');
    });

    test('should handle arrays', () => {
      const personWithArray = {
        '@type': 'Person',
        '@id': 'p1',
        'addresses': [address, { '@type': 'PostalAddress', '@id': 'addr2' }]
      };
      
      const result = h.children.toRefs(personWithArray);
      expect(result.addresses).toHaveLength(2);
      expect(result.addresses[0]).toEqual({
        '@type': 'PostalAddress',
        '@id': 'address-123'
      });
    });

    test('should handle null/undefined', () => {
      expect(h.children.toRefs(null)).toBeNull();
      expect(h.children.toRefs(undefined)).toBeUndefined();
    });

    test('should handle non-objects', () => {
      expect(h.children.toRefs('string')).toBe('string');
      expect(h.children.toRefs(123)).toBe(123);
    });

    test('should handle nested non-JSON-LD objects', () => {
      const obj = {
        '@type': 'Person',
        '@id': 'p1',
        'metadata': { created: '2023-01-01', version: 1 }
      };
      
      const result = h.children.toRefs(obj);
      expect(result.metadata).toEqual({ created: '2023-01-01', version: 1 });
    });
  });
});
