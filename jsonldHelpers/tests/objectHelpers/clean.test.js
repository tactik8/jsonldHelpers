
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('clean', () => {
  test('should remove undefined values', () => {
    const obj = {
      '@type': 'Person',
      '@id': 'person-123',
      'name': 'John Doe',
      'age': undefined,
      'email': 'john@example.com'
    };
    
    const result = h.clean(obj);
    expect(result.age).toBeUndefined();
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });

  test('should handle arrays', () => {
    const arr = [
      { '@type': 'Person', '@id': 'p1', 'name': 'John', 'empty': undefined },
      { '@type': 'Person', '@id': 'p2', 'name': 'Jane', 'age': 25 }
    ];
    
    const result = h.clean(arr);
    expect(result[0].empty).toBeUndefined();
    expect(result[0].name).toBe('John');
    expect(result[1].age).toBe(25);
  });

  test('should return undefined for empty array', () => {
    expect(h.clean([])).toBeUndefined();
  });

  test('should unwrap single-item arrays', () => {
    const arr = [{ '@type': 'Person', '@id': 'p1', 'name': 'John' }];
    const result = h.clean(arr);
    expect(Array.isArray(result)).toBe(false);
    expect(result['@type']).toBe('Person');
  });

  test('should preserve non-objects', () => {
    expect(h.clean('hello')).toBe('hello');
    expect(h.clean(123)).toBe(123);
    expect(h.clean(true)).toBe(true);
  });

  test('should handle nested objects', () => {
    const obj = {
      '@type': 'Person',
      '@id': 'p1',
      'name': 'John',
      'address': {
        'street': '123 Main St',
        'city': undefined,
        'country': 'USA'
      }
    };
    
    const result = h.clean(obj);
    expect(result.address.city).toBeUndefined();
    expect(result.address.street).toBe('123 Main St');
  });

  test('should handle null values', () => {
    const obj = {
      '@type': 'Person',
      '@id': 'p1',
      'name': 'John',
      'age': null
    };
    
    const result = h.clean(obj);
    expect(result.age).toBeNull();
    expect(result.name).toBe('John');
  });

  test('should preserve @type and @id', () => {
    const obj = {
      '@type': 'Person',
      '@id': 'p1',
      'empty': undefined
    };
    
    const result = h.clean(obj);
    expect(result['@type']).toBe('Person');
    expect(result['@id']).toBe('p1');
    expect(result.empty).toBeUndefined();
  });

  test('should handle non-JSON-LD objects', () => {
    const obj = { name: 'John', age: undefined };
    expect(h.clean(obj)).toBe(obj);
  });
});
