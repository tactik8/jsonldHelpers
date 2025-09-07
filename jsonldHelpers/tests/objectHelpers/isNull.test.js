
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('isNull', () => {
  test('should return true for null', () => {
    expect(h.isNull(null)).toBe(true);
  });

  test('should return true for undefined', () => {
    expect(h.isNull(undefined)).toBe(true);
  });

  test('should return false for 0', () => {
    expect(h.isNull(0)).toBe(false);
  });

  test('should return true for empty array', () => {
    expect(h.isNull([])).toBe(true);
  });

  test('should return false for non-empty array', () => {
    expect(h.isNull([1, 2, 3])).toBe(false);
  });

  test('should return true for JSON-LD object with only @type and @id', () => {
    const emptyPerson = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'person-123'
    };
    expect(h.isNull(emptyPerson)).toBe(true);
  });

  test('should return false for JSON-LD object with properties', () => {
    const person = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'person-123',
      'name': 'John Doe'
    };
    expect(h.isNull(person)).toBe(false);
  });

  test('should return false for non-JSON-LD object', () => {
    const obj = { name: 'John', age: 30 };
    expect(h.isNull(obj)).toBe(false);
  });

  test('should return true for non-JSON-LD object that is null/undefined', () => {
    expect(h.isNull(null)).toBe(true);
    expect(h.isNull(undefined)).toBe(true);
  });

  test('should return false for string', () => {
    expect(h.isNull('hello')).toBe(false);
    expect(h.isNull('')).toBe(false);
  });

  test('should return false for boolean', () => {
    expect(h.isNull(true)).toBe(false);
    expect(h.isNull(false)).toBe(false);
  });

  test('should handle cleaned objects', () => {
    const objWithUndefined = {
      '@type': 'Person',
      '@id': 'test',
      'name': undefined,
      'age': null
    };
    expect(h.isNull(objWithUndefined)).toBe(false);
  });
});
