
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('meetsFilterParams', () => {
  const person = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-123',
    'name': 'John Doe',
    'age': 30,
    'email': 'john@example.com'
  };

  test('should return true for valid object with no filter params', () => {
    expect(h.test(person)).toBe(true);
    expect(h.test(person, null)).toBe(true);
    expect(h.test(person, undefined)).toBe(true);
  });

  test('should return false for invalid object', () => {
    expect(h.test('invalid')).toBe(false);
    expect(h.test(123)).toBe(false);
    expect(h.test(null)).toBe(false);
    expect(h.test([])).toBe(false);
  });

  test('should match exact property values', () => {
    expect(h.test(person, { name: 'John Doe' })).toBe(true);
    expect(h.test(person, { age: 30 })).toBe(true);
    expect(h.test(person, { name: 'Jane Doe' })).toBe(false);
  });

  test('should match multiple properties', () => {
    expect(h.test(person, { name: 'John Doe', age: 30 })).toBe(true);
    expect(h.test(person, { name: 'John Doe', age: 25 })).toBe(false);
  });

  test('should handle $eq operator', () => {
    expect(h.test(person, { name: { $eq: 'John Doe' } })).toBe(true);
    expect(h.test(person, { age: { $eq: 30 } })).toBe(true);
    expect(h.test(person, { name: { $eq: 'Jane' } })).toBe(false);
  });

  test('should handle $ne operator', () => {
    expect(h.test(person, { name: { $ne: 'Jane Doe' } })).toBe(false);
    expect(h.test(person, { age: { $ne: 25 } })).toBe(false);
  });

  test('should handle $lt operator', () => {
    expect(h.test(person, { age: { $lt: 35 } })).toBe(true);
    expect(h.test(person, { age: { $lt: 25 } })).toBe(false);
  });

  test('should handle $le operator', () => {
    expect(h.test(person, { age: { $le: 30 } })).toBe(true);
    expect(h.test(person, { age: { $le: 29 } })).toBe(false);
  });

  test('should handle $gt operator', () => {
    expect(h.test(person, { age: { $gt: 25 } })).toBe(true);
    expect(h.test(person, { age: { $gt: 35 } })).toBe(false);
  });

  test('should handle $ge operator', () => {
    expect(h.test(person, { age: { $ge: 30 } })).toBe(true);
    expect(h.test(person, { age: { $ge: 35 } })).toBe(false);
  });

  test('should handle $includes operator', () => {
    expect(h.test(person, { email: { $includes: '@example.com' } })).toBe(true);
    expect(h.test(person, { name: { $includes: 'John' } })).toBe(true);
    expect(h.test(person, { name: { $includes: 'Jane' } })).toBe(false);
  });

  test('should handle $startsWith operator', () => {
    expect(h.test(person, { name: { $startsWith: 'John' } })).toBe(true);
    expect(h.test(person, { email: { $startsWith: 'john@' } })).toBe(true);
    expect(h.test(person, { name: { $startsWith: 'Jane' } })).toBe(false);
  });

  test('should handle $endsWith operator', () => {
    expect(h.test(person, { name: { $endsWith: 'Doe' } })).toBe(true);
    expect(h.test(person, { email: { $endsWith: '.com' } })).toBe(true);
    expect(h.test(person, { name: { $endsWith: 'Smith' } })).toBe(false);
  });

  test('should handle $regex operator', () => {
    expect(h.test(person, { email: { $regex: '.*@.*\\.com$' } })).toBe(true);
    expect(h.test(person, { name: { $regex: '^John.*' } })).toBe(true);
    expect(h.test(person, { name: { $regex: '^Jane.*' } })).toBe(false);
  });

  test('should handle $and operator', () => {
    expect(h.test(person, { $and: [{ age: 30 }, { name: 'John Doe' }] })).toBe(true);
    expect(h.test(person, { $and: [{ age: 25 }, { name: 'John Doe' }] })).toBe(false);
  });

  test('should handle $or operator', () => {
    expect(h.test(person, { $or: [{ age: 25 }, { name: 'John Doe' }] })).toBe(true);
    expect(h.test(person, { $or: [{ age: 25 }, { name: 'Jane Doe' }] })).toBe(false);
  });

  test('should handle $not operator', () => {
    expect(h.test(person, { $not: { age: 25 } })).toBe(true);
    expect(h.test(person, { $not: { age: 30 } })).toBe(false);
  });

  test('should handle strict mode', () => {
    const partialPerson = { '@type': 'Person', '@id': 'p1', name: 'John' };
    expect(h.test(partialPerson, { name: 'John', age: 30 }, undefined, true)).toBe(false);
    expect(h.test(partialPerson, { name: 'John' }, undefined, true)).toBe(true);
  });

  test('should handle negative filter params', () => {
    expect(h.test(person, { age: 30 }, { name: 'Jane' })).toBe(true);
    expect(h.test(person, { age: 30 }, { name: 'John Doe' })).toBe(false);
  });
});
