
import { objectHelpers as h } from '../../src/objectHelpers.js';

describe('getRef', () => {
  test('should get reference from valid object', () => {
    const obj = {
      '@context': 'https://schema.org/',
      '@type': 'Person',
      '@id': 'person-123',
      'name': 'John Doe',
      'email': 'john@example.com'
    };
    const ref = h.ref.get(obj);
    expect(ref).toEqual({
      '@type': 'Person',
      '@id': 'person-123'
    });
  });

  test('should return undefined for object without @type', () => {
    const obj = {
      '@id': 'person-123',
      'name': 'John Doe'
    };
    const ref = h.ref.get(obj);
    expect(ref).toBeUndefined();
  });

  test('should return undefined for object without @id', () => {
    const obj = {
      '@type': 'Person',
      'name': 'John Doe'
    };
    const ref = h.ref.get(obj);
    expect(ref).toBeUndefined();
  });

  test('should handle array of objects', () => {
    const objects = [
      { '@type': 'Person', '@id': 'person-1', 'name': 'John' },
      { '@type': 'Organization', '@id': 'org-1', 'name': 'Acme Corp' }
    ];
    const refs = h.ref.get(objects);
    expect(refs).toEqual([
      { '@type': 'Person', '@id': 'person-1' },
      { '@type': 'Organization', '@id': 'org-1' }
    ]);
  });

  test('should handle array with invalid objects', () => {
    const objects = [
      { '@type': 'Person', '@id': 'person-1' },
      { 'name': 'Invalid' },
      { '@type': 'Organization', '@id': 'org-1' }
    ];
    const refs = h.ref.get(objects);
    expect(refs[0]).toEqual({ '@type': 'Person', '@id': 'person-1' });
    expect(refs[1]).toBeUndefined();
    expect(refs[2]).toEqual({ '@type': 'Organization', '@id': 'org-1' });
  });

  test('should return undefined for null @type', () => {
    const obj = {
      '@type': null,
      '@id': 'person-123'
    };
    expect(h.ref.get(obj)).toBeUndefined();
  });

  test('should return undefined for null @id', () => {
    const obj = {
      '@type': 'Person',
      '@id': null
    };
    expect(h.ref.get(obj)).toBeUndefined();
  });

  test('should handle empty array', () => {
    expect(h.ref.get([])).toEqual([]);
  });
});
