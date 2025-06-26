
export function testClean(runner, h) {
    const testName = 'valueHelpers.clean';
    
    // Test number conversion
    const numberResult = h.value.clean('  123  ');
    runner.assert(numberResult.type === 'number', 'Should detect number type', testName);
    runner.assert(numberResult.cleaned === 123, 'Should convert to number', testName);
    runner.assert(numberResult.converted === true, 'Should mark as converted', testName);
    
    // Test string trimming
    const stringResult = h.value.clean('  hello world  ');
    runner.assert(stringResult.type === 'string', 'Should detect string type', testName);
    runner.assert(stringResult.cleaned === 'hello world', 'Should trim whitespace', testName);
    runner.assert(stringResult.converted === true, 'Should mark as converted', testName);
    
    // Test boolean conversion
    const boolResult = h.value.clean('true');
    runner.assert(boolResult.type === 'boolean', 'Should detect boolean type', testName);
    runner.assert(boolResult.cleaned === true, 'Should convert to boolean', testName);
    
    // Test date conversion
    const dateResult = h.value.clean('2024-01-01');
    runner.assert(dateResult.type === 'date', 'Should detect date type', testName);
    runner.assert(dateResult.cleaned instanceof Date, 'Should convert to Date object', testName);
    
    // Test email detection
    const emailResult = h.value.clean('test@example.com');
    runner.assert(emailResult.type === 'email', 'Should detect email type', testName);
    runner.assert(emailResult.cleaned === 'test@example.com', 'Should preserve email', testName);
    
    // Test URL detection
    const urlResult = h.value.clean('https://example.com');
    runner.assert(urlResult.type === 'url', 'Should detect URL type', testName);
    runner.assert(urlResult.cleaned === 'https://example.com', 'Should preserve URL', testName);
    
    // Test JSON parsing
    const jsonResult = h.value.clean('{"key": "value"}');
    runner.assert(jsonResult.type === 'json', 'Should detect JSON type', testName);
    runner.assert(jsonResult.cleaned.key === 'value', 'Should parse JSON', testName);
    
    // Test null/undefined
    const nullResult = h.value.clean(null);
    runner.assert(nullResult.type === 'null', 'Should handle null', testName);
    
    const undefinedResult = h.value.clean(undefined);
    runner.assert(undefinedResult.type === 'undefined', 'Should handle undefined', testName);
    
    // Test non-string objects
    const objResult = h.value.clean({ test: 'value' });
    runner.assert(objResult.type === 'Object', 'Should handle objects', testName);
    runner.assert(objResult.converted === false, 'Should not convert objects', testName);
    
    // Test edge cases
    const emptyString = h.value.clean('');
    runner.assert(emptyString.type === 'string', 'Should handle empty string', testName);
    
    const floatResult = h.value.clean('123.45');
    runner.assert(floatResult.cleaned === 123.45, 'Should handle float numbers', testName);
    
    const invalidJson = h.value.clean('{"invalid": json}');
    runner.assert(invalidJson.type === 'string', 'Should fallback to string for invalid JSON', testName);
}
