
import { PropertyHelpers as p } from '../../src/propertyHelpers/propertyHelpers.models.js';

describe('setRecordType', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe'
  };

  test('should set type for valid object', () => {
    const result = p.type.set(person, 'Employee');
    expect(result['@type']).toBe('Employee');
    expect(result['@id']).toBe('person-123');
    expect(result.name).toBe('John Doe');
    expect(result['@context']).toBe('https://schema.org/');
  });

  test('should not mutate original object', () => {
    const original = { ...person };
    p.type.set(person, 'Employee');
    expect(person).toEqual(original);
  });

  test('should handle setting array of types', () => {
    const result = p.type.set(person, ['Person', 'Employee']);
    expect(result['@type']).toEqual(['Person', 'Employee']);
  });

  test('should create @type property if it does not exist', () => {
    const noType = {
      '@context': 'https://schema.org/',
      '@id': 'thing-123',
      'name': 'Something'
    };
    const result = p.type.set(noType, 'Thing');
    expect(result['@type']).toBe('Thing');
    expect(result.name).toBe('Something');
  });

  test('should handle null input', () => {
    expect(p.type.set(null, 'Person')).toEqual({"@type": "Person"});
  });

  test('should handle undefined input', () => {
    expect(p.type.set(undefined, 'Person')).toEqual({"@type": "Person"});
  });

  test('should handle invalid object types', () => {
    expect(p.type.set('string', 'Person')).toBeUndefined();
    expect(p.type.set(123, 'Person')).toBeUndefined();
    expect(p.type.set([], 'Person')).toBeUndefined();
  });

  test('should handle empty object', () => {
    const result = p.type.set({}, 'Thing');
    expect(result['@type']).toBe('Thing');
  });

  test('should overwrite existing type', () => {
    const multiType = {
      '@type': ['Person', 'Employee'],
      '@id': 'person-123'
    };
    const result = p.type.set(multiType, 'Customer');
    expect(result['@type']).toBe('Customer');
  });
});
