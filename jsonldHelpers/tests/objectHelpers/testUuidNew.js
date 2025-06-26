
export function testUuidNew(runner, h) {
    const testName = 'objectHelpers.uuid.new';
    
    // Test basic UUID generation
    const uuid1 = h.uuid.new();
    const uuid2 = h.uuid.new();
    
    runner.assert(typeof uuid1 === 'string', 'Should return a string', testName);
    runner.assert(uuid1.length === 36, 'Should return 36 character string', testName);
    runner.assert(uuid1 !== uuid2, 'Should generate unique UUIDs', testName);
    
    // Test UUID format (8-4-4-4-12)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    runner.assert(uuidRegex.test(uuid1), 'Should match UUID v4 format', testName);
    
    // Test multiple generations
    const uuids = [];
    for (let i = 0; i < 100; i++) {
        uuids.push(h.uuid.new());
    }
    const uniqueUuids = [...new Set(uuids)];
    runner.assert(uniqueUuids.length === 100, 'Should generate 100 unique UUIDs', testName);
}
