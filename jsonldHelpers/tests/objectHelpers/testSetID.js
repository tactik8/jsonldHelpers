
export function testSetID(runner, h) {
    const testName = 'objectHelpers.setID';
    
    // Test with valid object without ID
    const obj = { '@type': 'Thing', 'name': 'Test' };
    const result = h.setID(obj);
    runner.assert(typeof result['@id'] === 'string', 'Should add ID to object', testName);
    runner.assert(result['@id'].length === 36, 'Should add UUID format ID', testName);
    
    // Test with object that already has ID
    const objWithId = { '@type': 'Thing', '@id': 'existing-id', 'name': 'Test' };
    const resultWithId = h.setID(objWithId);
    runner.assert(resultWithId['@id'] === 'existing-id', 'Should preserve existing ID', testName);
    
    // Test with array
    const array = [
        { '@type': 'Thing', 'name': 'Test1' },
        { '@type': 'Thing', 'name': 'Test2' }
    ];
    const arrayResult = h.setID(array);
    runner.assert(Array.isArray(arrayResult), 'Should return array', testName);
    runner.assert(typeof arrayResult[0]['@id'] === 'string', 'Should add ID to first item', testName);
    runner.assert(typeof arrayResult[1]['@id'] === 'string', 'Should add ID to second item', testName);
    
    // Test with invalid object
    const invalidObj = { 'name': 'No Type' };
    runner.assertThrows(() => h.setID(invalidObj), 'Should throw for invalid object', testName);
    
    // Test with default value
    const invalidObjWithDefault = { 'name': 'No Type' };
    const defaultResult = h.setID(invalidObjWithDefault, 'default-value');
    runner.assert(defaultResult === 'default-value', 'Should return default value', testName);
    
    // Test edge cases
    runner.assertThrows(() => h.setID(null), 'Should throw for null', testName);
    runner.assertThrows(() => h.setID(undefined), 'Should throw for undefined', testName);
    runner.assertThrows(() => h.setID('string'), 'Should throw for string', testName);
}
