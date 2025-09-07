
import { PropertyHelpers as p } from '../../src/propertyHelpers/propertyHelpers.models.js';

describe('setValue', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 30,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Main St'
    }
  };

  test('should set simple property value', () => {
    const result = p.value.set(person, 'name', 'Jane Doe');
    expect(result.name).toBe('Jane Doe');
    expect(result.age).toBe(30);
    expect(result['@id']).toBe('person-123');
  });

  test('should not mutate original object', () => {
    const original = JSON.parse(JSON.stringify(person));
    p.value.set(person, 'name', 'Jane Doe');
    expect(person).toEqual(original);
  });

  test('should set nested property value', () => {
    const result = p.value.set(person, 'address.streetAddress', '456 Oak St');
    expect(result.address.streetAddress).toBe('456 Oak St');
    expect(result.name).toBe('John Doe');
  });

  test('should create nested structure if it does not exist', () => {
    const result = p.value.set(person, 'contact.email', 'john@example.com');
    expect(result.contact.email).toBe('john@example.com');
    expect(result.name).toBe('John Doe');
  });

  test('should set array values', () => {
    const result = p.value.set(person, 'hobbies', ['reading', 'swimming']);
    expect(result.hobbies).toEqual(['reading', 'swimming']);
  });

  test('should set array element by index', () => {
    const withArray = { ...person, hobbies: ['reading', 'swimming'] };
    const result = p.value.set(withArray, 'hobbies[0]', 'cooking');
    expect(result.hobbies[0]).toBe('cooking');
    expect(result.hobbies[1]).toBe('swimming');
  });

  test('should extend array if index is beyond current length', () => {
    const withArray = { ...person, hobbies: ['reading'] };
    const result = p.value.set(withArray, 'hobbies[3]', 'cycling');
    expect(result.hobbies[0]).toBe('reading');
    expect(result.hobbies[1]).toBeUndefined();
    expect(result.hobbies[2]).toBeUndefined();
    expect(result.hobbies[3]).toBe('cycling');
  });

  test('should create array structure for array notation', () => {
    const result = p.value.set(person, 'skills[0]', 'JavaScript');
    expect(Array.isArray(result.skills)).toBe(true);
    expect(result.skills[0]).toBe('JavaScript');
  });

  test('should handle null and undefined objects', () => {
    expect(p.value.set(null, 'name', 'value')).toEqual({"name": "value"})
    expect(p.value.set(undefined, 'name', 'value')).toEqual({"name": "value"})
  });

  test('should handle invalid path types', () => {
    expect(p.value.set(person, null, 'value')).toBeUndefined();
    expect(p.value.set(person, 123, 'value')).toBeUndefined();
  });

  test('should return original object if value is already the same', () => {
    const result = p.value.set(person, 'name', 'John Doe');
    expect(result).toEqual(person);
  });

  test('should handle complex nested paths', () => {
    const result = p.value.set(person, 'employment.company.name', 'Tech Corp');
    expect(result.employment.company.name).toBe('Tech Corp');
  });

  test('should handle setting JSON-LD properties', () => {
    const result = p.value.set(person, '@type', 'Employee');
    expect(result['@type']).toBe('Employee');
    expect(result['@id']).toBe('person-123');
  });

  test('should handle deep array nesting', () => {
    const result = p.value.set(person, 'projects[0].tasks[1].name', 'Task 2');
    expect(result.projects[0].tasks[1].name).toBe('Task 2');
  });

  test('should return default value when provided and operation fails', () => {
    expect(p.value.set(null, 123, 'value', 'default')).toBe('default');
  });

  test('should handle setting undefined and null values', () => {
    const result1 = p.value.set(person, 'newProp', undefined);
    expect(result1.newProp).toBeUndefined();
    
    const result2 = p.value.set(person, 'nullProp', null);
    expect(result2.nullProp).toBeNull();
  });
});
