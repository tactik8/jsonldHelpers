
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('isJsonldObject', () => {
  test('should return true for valid JSON-LD object with @type and @id', () => {
    const obj = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'person-123',
      'name': 'John Doe'
    };
    expect(h.isValid(obj)).toBe(true);
  });

  test('should return true for valid JSON-LD object with only @type', () => {
    const obj = {
      '@type': 'Person',
      'name': 'John Doe'
    };
    expect(h.isValid(obj)).toBe(true);
  });

  test('should return false for object without @type', () => {
    const obj = {
      '@id': 'person-123',
      'name': 'John Doe'
    };
    expect(h.isValid(obj)).toBe(false);
  });

  test('should return false for object with null @type', () => {
    const obj = {
      '@type': null,
      '@id': 'person-123',
      'name': 'John Doe'
    };
    expect(h.isValid(obj)).toBe(false);
  });

  test('should return false for array', () => {
    const arr = [{ '@type': 'Person', 'name': 'John' }];
    expect(h.isValid(arr)).toBe(false);
  });

  test('should return false for string', () => {
    expect(h.isValid('string')).toBe(false);
  });

  test('should return false for number', () => {
    expect(h.isValid(123)).toBe(false);
  });

  test('should return false for null', () => {
    expect(h.isValid(null)).toBe(false);
  });

  test('should return false for undefined', () => {
    expect(h.isValid(undefined)).toBe(false);
  });

  test('should return false for boolean', () => {
    expect(h.isValid(true)).toBe(false);
    expect(h.isValid(false)).toBe(false);
  });

  test('should return false for empty object', () => {
    expect(h.isValid({})).toBe(false);
  });
});
