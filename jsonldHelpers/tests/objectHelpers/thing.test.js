
import { ObjectHelpers as h } from '../../src/objectHelpers/objectHelpers.models.js';

describe('thing', () => {
  test('should create a Thing with default type', () => {
    const thing = h.new();
    expect(thing['@context']).toBe('https://schema.org/');
    expect(thing['@type']).toBe('Thing');
    expect(thing['@id']).toBeDefined();
    expect(typeof thing['@id']).toBe('string');
  });

  test('should create a Person with specified type', () => {
    const person = h.new('Person');
    expect(person['@context']).toBe('https://schema.org/');
    expect(person['@type']).toBe('Person');
    expect(person['@id']).toBeDefined();
  });

  test('should create record with specified id', () => {
    const customId = 'custom-id-123';
    const thing = h.new('Thing', customId);
    expect(thing['@id']).toBe(customId);
  });

  test('should create Organization with custom id', () => {
    const org = h.new('Organization', 'org-456');
    expect(org['@type']).toBe('Organization');
    expect(org['@id']).toBe('org-456');
    expect(org['@context']).toBe('https://schema.org/');
  });

  test('should handle undefined parameters', () => {
    const thing = h.new(undefined, undefined);
    expect(thing['@type']).toBe('Thing');
    expect(thing['@id']).toBeDefined();
  });

  test('should handle null parameters', () => {
    const thing = h.new(null, null);
    expect(thing['@type']).toBe(null);
    expect(thing['@id']).toBeDefined();
  });
});
