
import { objectHelpers as h } from '../../src/objectHelpers.js';

describe('comparison functions', () => {
  const person1 = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-1',
    'name': 'John Doe'
  };

  const person2 = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-2',
    'name': 'Jane Doe'
  };

  const person1Copy = {
    '@context': 'https://schema.org/',
    '@type': 'Person',
    '@id': 'person-1',
    'name': 'John Doe',
    'age': 30
  };

  describe('eq', () => {
    test('should return true for equal objects', () => {
      expect(h.eq(person1, person1Copy)).toBe(true);
    });

    test('should return false for different objects', () => {
      expect(h.eq(person1, person2)).toBe(false);
    });

    test('should handle null values', () => {
      expect(h.eq(null, null)).toBe(true);
      expect(h.eq(null, person1)).toBe(false);
      expect(h.eq(person1, null)).toBe(false);
    });

    test('should handle undefined values', () => {
      expect(h.eq(undefined, undefined)).toBe(true);
      expect(h.eq(undefined, person1)).toBe(false);
    });

    test('should handle non-objects', () => {
      expect(h.eq('hello', 'hello')).toBe(true);
      expect(h.eq(123, 123)).toBe(true);
      expect(h.eq('hello', 'world')).toBe(false);
    });

    test('should handle mixed types', () => {
      expect(h.eq(person1, 'string')).toBe(false);
      expect(h.eq(123, person1)).toBe(false);
    });
  });

  describe('lt', () => {
    test('should compare objects by @type then @id', () => {
      expect(h.lt(person1, person2)).toBe(true); // person-1 < person-2
    });

    test('should handle undefined/null', () => {
      expect(h.lt(null, person1)).toBe(true);
      expect(h.lt(person1, null)).toBe(false);
      expect(h.lt(null, null)).toBe(false);
      expect(h.lt(undefined, person1)).toBe(true);
    });

    test('should compare non-objects', () => {
      expect(h.lt(1, 2)).toBe(true);
      expect(h.lt('a', 'b')).toBe(true);
      expect(h.lt(2, 1)).toBe(false);
    });

    test('should compare by @type first', () => {
      const org = { '@type': 'Organization', '@id': 'org-1' };
      expect(h.lt(org, person1)).toBe(true); // Organization < Person
    });

    test('should handle dates', () => {
      const date1 = new Date('2020-01-01');
      const date2 = new Date('2021-01-01');
      expect(h.lt(date1, date2)).toBe(true);
    });
  });

  describe('gt', () => {
    test('should compare objects by @type then @id', () => {
      expect(h.gt(person2, person1)).toBe(true); // person-2 > person-1
    });

    test('should handle undefined/null', () => {
      expect(h.gt(person1, null)).toBe(true);
      expect(h.gt(null, person1)).toBe(false);
      expect(h.gt(null, null)).toBe(false);
    });

    test('should compare non-objects', () => {
      expect(h.gt(2, 1)).toBe(true);
      expect(h.gt('b', 'a')).toBe(true);
      expect(h.gt(1, 2)).toBe(false);
    });
  });

  describe('le', () => {
    test('should return true for less than or equal', () => {
      expect(h.le(person1, person2)).toBe(true);
      expect(h.le(person1, person1Copy)).toBe(true);
    });

    test('should return false for greater than', () => {
      expect(h.le(person2, person1)).toBe(false);
    });
  });

  describe('ge', () => {
    test('should return true for greater than or equal', () => {
      expect(h.ge(person2, person1)).toBe(true);
      expect(h.ge(person1, person1Copy)).toBe(true);
    });

    test('should return false for less than', () => {
      expect(h.ge(person1, person2)).toBe(false);
    });
  });
});
