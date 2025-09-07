
import { PropertyHelpers as p } from '../../src/propertyHelpers/propertyHelpers.models.js';

describe('setRecordId', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe'
  };

  test('should set id for valid object', () => {
    const result = p.id.set(person, 'person-456');
    expect(result['@id']).toBe('person-456');
    expect(result['@type']).toBe('Person');
    expect(result.name).toBe('John Doe');
    expect(result['@context']).toBe('https://schema.org/');
  });

  test('should not mutate original object', () => {
    const original = { ...person };
    p.id.set(person, 'person-456');
    expect(person).toEqual(original);
  });

  test('should handle setting array of ids', () => {
    const result = p.id.set(person, ['id-1', 'id-2']);
    expect(result['@id']).toEqual(['id-1', 'id-2']);
  });

  test('should create @id property if it does not exist', () => {
    const noId = {
      '@context': 'https://schema.org/',
      '@type': 'Thing',
      'name': 'Something'
    };
    const result = p.id.set(noId, 'thing-123');
    expect(result['@id']).toBe('thing-123');
    expect(result.name).toBe('Something');
  });

  test('should handle null input', () => {
    expect(p.id.set(null, 'person-123')).toEqual({"@id": "person-123"});
  });

  test('should handle undefined input', () => {
    expect(p.id.set(undefined, 'person-123')).toEqual({"@id": "person-123"});
  });

  test('should handle invalid object types', () => {
    expect(p.id.set('string', 'person-123')).toBeUndefined();
    expect(p.id.set(123, 'person-123')).toBeUndefined();
    expect(p.id.set([], 'person-123')).toBeUndefined();
  });

  test('should handle empty object', () => {
    const result = p.id.set({}, 'thing-123');
    expect(result['@id']).toBe('thing-123');
  });

  test('should overwrite existing id', () => {
    const multiId = {
      '@type': 'Thing',
      '@id': ['id-1', 'id-2']
    };
    const result = p.id.set(multiId, 'new-id');
    expect(result['@id']).toBe('new-id');
  });

  test('should handle numeric IDs', () => {
    const result = p.id.set(person, 12345);
    expect(result['@id']).toBe(12345);
  });

  test('should handle URL IDs', () => {
    const result = p.id.set(person, 'https://example.com/person/123');
    expect(result['@id']).toBe('https://example.com/person/123');
  });
});
