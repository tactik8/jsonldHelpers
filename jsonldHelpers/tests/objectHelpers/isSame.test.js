
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('isSame', () => {
  const person1 = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe'
  };

  const person1Different = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'Jane Doe',
    'age': 25
  };

  const person2 = {
    '@type': 'Person',
    '@id': 'person-456',
    'name': 'John Doe'
  };

  test('should return true for same objects (same @type and @id)', () => {
    expect(h.isSame(person1, person1Different)).toBe(true);
  });

  test('should return false for different @id', () => {
    expect(h.isSame(person1, person2)).toBe(false);
  });

  test('should return false for different @type', () => {
    const org = { '@type': 'Organization', '@id': 'person-123' };
    expect(h.isSame(person1, org)).toBe(false);
  });

  test('should handle undefined values', () => {
    expect(h.isSame(undefined, undefined)).toBe(true);
    expect(h.isSame(person1, undefined)).toBe(false);
    expect(h.isSame(undefined, person1)).toBe(false);
  });

  test('should handle null values', () => {
    expect(h.isSame(null, null)).toBe(true);
    expect(h.isSame(person1, null)).toBe(false);
    expect(h.isSame(null, person1)).toBe(false);
  });

  test('should handle arrays', () => {
    const arr1 = [person1, person2];
    const arr2 = [person1, person2];
    const arr3 = [person2, person1];
    
    expect(h.isSame(arr1, arr2)).toBe(true);
    expect(h.isSame(arr1, arr3)).toBe(true);
    expect(h.isSame(arr1, [person1])).toBe(false);
  });

  test('should handle mixed array and non-array', () => {
    expect(h.isSame([person1], person1)).toBe(true);
    expect(h.isSame(person1, [person1])).toBe(true);
    expect(h.isSame([person1, person2], person1)).toBe(false);
  });

  test('should handle non-objects', () => {
    expect(h.isSame('hello', 'hello')).toBe(true);
    expect(h.isSame(123, 123)).toBe(true);
    expect(h.isSame('hello', 'world')).toBe(false);
    expect(h.isSame(123, 456)).toBe(false);
  });

  test('should return false for objects without proper @type or @id', () => {
    const invalidObj1 = { '@id': 'test' };
    const invalidObj2 = { '@type': 'Person' };
    
    expect(h.isSame(invalidObj1, invalidObj2)).toBe(false);
    expect(h.isSame(person1, invalidObj1)).toBe(false);
  });

  test('should handle objects with undefined @type or @id', () => {
    const obj1 = { '@type': 'Person', '@id': undefined };
    const obj2 = { '@type': undefined, '@id': 'test' };
    
    expect(h.isSame(obj1, obj2)).toBe(false);
    expect(h.isSame(obj1, person1)).toBe(false);
  });
});
