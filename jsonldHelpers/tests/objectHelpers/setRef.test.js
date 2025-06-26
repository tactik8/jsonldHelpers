
import { objectHelpers as h } from '../../src/objectHelpers.js';

describe('setRef', () => {
  test('should set reference on object', () => {
    const obj = {
      'name': 'John Doe',
      'email': 'john@example.com'
    };
    const ref = {
      '@type': 'Person',
      '@id': 'person-123'
    };
    const result = h.ref.set(obj, ref);
    expect(result['@type']).toBe('Person');
    expect(result['@id']).toBe('person-123');
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });

  test('should overwrite existing @type and @id', () => {
    const obj = {
      '@type': 'Organization',
      '@id': 'old-id',
      'name': 'John Doe'
    };
    const ref = {
      '@type': 'Person',
      '@id': 'new-id'
    };
    const result = h.ref.set(obj, ref);
    expect(result['@type']).toBe('Person');
    expect(result['@id']).toBe('new-id');
  });

  test('should handle undefined ref', () => {
    const obj = { 'name': 'John' };
    const result = h.ref.set(obj, undefined);
    expect(result['@type']).toBeUndefined();
    expect(result['@id']).toBeUndefined();
  });

  test('should handle null ref', () => {
    const obj = { 'name': 'John' };
    const result = h.ref.set(obj, null);
    expect(result['@type']).toBeUndefined();
    expect(result['@id']).toBeUndefined();
  });

  test('should handle ref with missing @type', () => {
    const obj = { 'name': 'John' };
    const ref = { '@id': 'person-123' };
    const result = h.ref.set(obj, ref);
    expect(result['@type']).toBeUndefined();
    expect(result['@id']).toBe('person-123');
  });

  test('should handle ref with missing @id', () => {
    const obj = { 'name': 'John' };
    const ref = { '@type': 'Person' };
    const result = h.ref.set(obj, ref);
    expect(result['@type']).toBe('Person');
    expect(result['@id']).toBeUndefined();
  });

  test('should modify original object', () => {
    const obj = { 'name': 'John' };
    const ref = { '@type': 'Person', '@id': 'person-123' };
    h.ref.set(obj, ref);
    expect(obj['@type']).toBe('Person');
    expect(obj['@id']).toBe('person-123');
  });
});
