
import { objectHelpers as h } from '../../src/objectHelpers.js';

describe('flatten and unflatten functions', () => {
  const address = {
    '@context': 'https://schema.org/',
    '@type': 'PostalAddress',
    '@id': 'address-123',
    'streetAddress': '123 Main St',
    'addressLocality': 'Anytown'
  };

  const organization = {
    '@type': 'Organization',
    '@id': 'org-456',
    'name': 'Acme Corp',
    'address': address
  };

  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'address': address,
    'worksFor': organization
  };

  describe('flattenObject', () => {
    test('should flatten nested objects into separate records', () => {
      const flattened = h.flatten(person);
      expect(flattened).toHaveLength(3); // person, address, organization
      
      // Find each record type
      const personRecord = flattened.find(r => r['@type'] === 'Person');
      const addressRecord = flattened.find(r => r['@type'] === 'PostalAddress');
      const orgRecord = flattened.find(r => r['@type'] === 'Organization');
      
      expect(personRecord).toBeDefined();
      expect(addressRecord).toBeDefined();
      expect(orgRecord).toBeDefined();
      
      // Check that nested objects are replaced with references
      expect(personRecord.address).toEqual({ '@type': 'PostalAddress', '@id': 'address-123' });
      expect(personRecord.worksFor).toEqual({ '@type': 'Organization', '@id': 'org-456' });
      expect(orgRecord.address).toEqual({ '@type': 'PostalAddress', '@id': 'address-123' });
    });

    test('should handle arrays', () => {
      const people = [person, { '@type': 'Person', '@id': 'p2', 'name': 'Jane' }];
      const flattened = h.flatten(people);
      expect(flattened.length).toBeGreaterThan(2);
    });

    test('should handle null/undefined', () => {
      expect(h.flatten(null)).toBeNull();
      expect(h.flatten(undefined)).toBeUndefined();
    });

    test('should handle non-objects', () => {
      expect(h.flatten('string')).toBe('string');
      expect(h.flatten(123)).toBe(123);
    });

    test('should handle simple objects without nesting', () => {
      const simple = { '@type': 'Person', '@id': 'p1', 'name': 'John' };
      const flattened = h.flatten(simple);
      expect(flattened).toHaveLength(1);
      expect(flattened[0]).toEqual(simple);
    });

    test('should deduplicate records', () => {
      const personWithDuplicateAddress = {
        '@type': 'Person',
        '@id': 'p1',
        'homeAddress': address,
        'workAddress': address
      };
      
      const flattened = h.flatten(personWithDuplicateAddress);
      const addressRecords = flattened.filter(r => r['@type'] === 'PostalAddress');
      expect(addressRecords).toHaveLength(1);
    });
  });

  describe('unFlattenObject', () => {
    test('should reconstruct nested objects from flat list', () => {
      const flattened = h.flatten(person);
      const personRef = { '@type': 'Person', '@id': 'person-123' };
      const reconstructed = h.unFlatten(personRef, flattened);
      
      expect(reconstructed.name).toBe('John Doe');
      expect(reconstructed.address.streetAddress).toBe('123 Main St');
      expect(reconstructed.worksFor.name).toBe('Acme Corp');
      expect(reconstructed.worksFor.address.streetAddress).toBe('123 Main St');
    });

    test('should handle missing records gracefully', () => {
      const personRef = { '@type': 'Person', '@id': 'person-123' };
      const incompleteList = [
        { '@type': 'Person', '@id': 'person-123', 'name': 'John', 'address': { '@type': 'PostalAddress', '@id': 'missing' } }
      ];
      
      const result = h.unFlatten(personRef, incompleteList);
      expect(result.name).toBe('John');
      expect(result.address).toEqual({ '@type': 'PostalAddress', '@id': 'missing' });
    });

    test('should handle arrays', () => {
      const refs = [
        { '@type': 'Person', '@id': 'person-123' },
        { '@type': 'PostalAddress', '@id': 'address-123' }
      ];
      const flattened = h.flatten(person);
      const result = h.unFlatten(refs, flattened);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].streetAddress).toBe('123 Main St');
    });

    test('should handle null/undefined', () => {
      expect(h.unFlatten(null, [])).toBeNull();
      expect(h.unFlatten(undefined, [])).toBeUndefined();
    });

    test('should handle non-objects', () => {
      expect(h.unFlatten('string', [])).toBe('string');
      expect(h.unFlatten(123, [])).toBe(123);
    });

    test('should prevent infinite recursion', () => {
      const circularRef = { '@type': 'Person', '@id': 'p1' };
      const circularRecords = [
        { '@type': 'Person', '@id': 'p1', 'friend': circularRef }
      ];
      
      // Should not throw or hang
      const result = h.unFlatten(circularRef, circularRecords);
      expect(result.friend).toBeDefined();
    });

    test('should handle complex nested structures', () => {
      const complexPerson = {
        '@type': 'Person',
        '@id': 'p1',
        'name': 'John',
        'addresses': [address, { '@type': 'PostalAddress', '@id': 'addr2', 'streetAddress': '456 Oak St' }],
        'organization': organization
      };
      
      const flattened = h.flatten(complexPerson);
      const personRef = { '@type': 'Person', '@id': 'p1' };
      const reconstructed = h.unFlatten(personRef, flattened);
      
      expect(reconstructed.addresses).toHaveLength(2);
      expect(reconstructed.addresses[0].streetAddress).toBe('123 Main St');
      expect(reconstructed.organization.name).toBe('Acme Corp');
    });
  });
});
