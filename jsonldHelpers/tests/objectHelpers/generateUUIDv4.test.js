
import { objectHelpers as h } from '../../src/objectHelpers.js';

describe('generateUUIDv4', () => {
  test('should generate a valid UUID v4', () => {
    const uuid = h.uuid.new();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(uuid).toMatch(uuidRegex);
  });

  test('should generate unique UUIDs', () => {
    const uuid1 = h.uuid.new();
    const uuid2 = h.uuid.new();
    expect(uuid1).not.toBe(uuid2);
  });

  test('should generate UUID with version 4', () => {
    const uuid = h.uuid.new();
    expect(uuid.charAt(14)).toBe('4');
  });

  test('should generate UUID with correct variant', () => {
    const uuid = h.uuid.new();
    const variantChar = uuid.charAt(19);
    expect(['8', '9', 'a', 'b']).toContain(variantChar.toLowerCase());
  });

  test('should generate UUID with correct length', () => {
    const uuid = h.uuid.new();
    expect(uuid.length).toBe(36);
  });
});
