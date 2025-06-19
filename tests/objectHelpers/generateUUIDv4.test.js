
import { objectHelpers } from '../src/src/objectHelpers.js';

describe('generateUUIDv4', () => {
    test('should generate a valid UUID v4', () => {
        const uuid = objectHelpers.uuid.new();
        
        // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        expect(uuid).toMatch(uuidRegex);
    });

    test('should generate unique UUIDs', () => {
        const uuid1 = objectHelpers.uuid.new();
        const uuid2 = objectHelpers.uuid.new();
        
        expect(uuid1).not.toBe(uuid2);
    });

    test('should generate UUIDs with correct length', () => {
        const uuid = objectHelpers.uuid.new();
        expect(uuid).toHaveLength(36); // 32 chars + 4 hyphens
    });

    test('should generate UUIDs with correct version and variant bits', () => {
        const uuid = objectHelpers.uuid.new();
        const parts = uuid.split('-');
        
        // Version 4 check (13th hex digit should be 4)
        expect(parts[2][0]).toBe('4');
        
        // Variant check (17th hex digit should be 8, 9, a, or b)
        expect(['8', '9', 'a', 'b']).toContain(parts[3][0].toLowerCase());
    });
});
