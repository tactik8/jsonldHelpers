
export function testNew(runner, h) {
    const testName = 'objectHelpers.new';
    
    // Test basic thing creation
    const thing = h.new();
    runner.assert(h.isValid(thing), 'Should create valid JSON-LD object', testName);
    runner.assert(thing['@type'] === 'Thing', 'Should default to Thing type', testName);
    runner.assert(typeof thing['@id'] === 'string', 'Should have string ID', testName);
    runner.assert(thing['@context'] === 'https://schema.org/', 'Should have schema.org context', testName);
    
    // Test with custom type
    const person = h.new('Person');
    runner.assert(person['@type'] === 'Person', 'Should create Person type', testName);
    runner.assert(h.isValid(person), 'Should be valid JSON-LD object', testName);
    
    // Test with custom type and ID
    const customThing = h.new('CustomType', 'custom-id');
    runner.assert(customThing['@type'] === 'CustomType', 'Should use custom type', testName);
    runner.assert(customThing['@id'] === 'custom-id', 'Should use custom ID', testName);
    
    // Test edge cases
    const emptyType = h.new('');
    runner.assert(emptyType['@type'] === '', 'Should handle empty type', testName);
    
    const nullType = h.new(null);
    runner.assert(nullType['@type'] === null, 'Should handle null type', testName);
}
