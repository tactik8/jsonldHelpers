
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('mergeRecords', () => {
  const person1 = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 30
  };

  const person1Extended = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'email': 'john@example.com',
    'address': 'New York'
  };

  const person2 = {
    '@type': 'Person',
    '@id': 'person-456',
    'name': 'Jane Doe'
  };

  test('should merge records with same reference', () => {
    const result = h.merge(person1, person1Extended);
    expect(result['@type']).toBe('Person');
    expect(result['@id']).toBe('person-123');
    expect(result.name).toBe('John Doe');
    expect(result.age).toBe(30);
    expect(result.email).toBe('john@example.com');
    expect(result.address).toBe('New York');
  });

  test('should return undefined for records with different references', () => {
    const result = h.merge(person1, person2);
    expect(result).toBeUndefined();
  });

  test('should return undefined for non-JSON-LD objects', () => {
    const nonJsonld = { name: 'John' };
    expect(h.merge(nonJsonld, person1)).toBeUndefined();
    expect(h.merge(person1, nonJsonld)).toBeUndefined();
  });

  test('should handle overlapping properties', () => {
    const person1Modified = {
      '@type': 'Person',
      '@id': 'person-123',
      'name': 'John Smith',
      'age': 30
    };
    
    const result = h.merge(person1, person1Modified);
    expect(result.name).toEqual(['John Doe', 'John Smith']);
    expect(result.age).toBe(30);
  });

  test('should handle array properties', () => {
    const obj1 = {
      '@type': 'Person',
      '@id': 'p1',
      'hobbies': ['reading', 'swimming']
    };
    const obj2 = {
      '@type': 'Person',
      '@id': 'p1',
      'hobbies': ['cooking', 'gaming']
    };
    
    const result = h.merge(obj1, obj2);
    expect(result.hobbies).toEqual(['reading', 'swimming', 'cooking', 'gaming']);
  });

  test('should clean the merged record', () => {
    const obj1 = {
      '@type': 'Person',
      '@id': 'p1',
      'name': 'John',
      'empty': undefined
    };
    const obj2 = {
      '@type': 'Person',
      '@id': 'p1',
      'age': 30,
      'nullValue': null
    };
    
    const result = h.merge(obj1, obj2);
    expect(result.empty).toBeUndefined();
    expect(result.name).toBe('John');
    expect(result.age).toBe(30);
  });

  test('should preserve context from first record', () => {
    const result = h.merge(person1, person1Extended);
    expect(result['@context']).toBe('https://schema.org/');
  });

  test('should handle records with only @type and @id', () => {
    const minimal1 = { '@type': 'Person', '@id': 'p1' };
    const minimal2 = { '@type': 'Person', '@id': 'p1' };
    
    const result = h.merge(minimal1, minimal2);
    expect(result['@type']).toBe('Person');
    expect(result['@id']).toBe('p1');
  });
});
