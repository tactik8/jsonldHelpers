
import { testData } from '../testData.js';

export function testValueGet(runner, h) {
    const testName = 'propertyHelpers.value.get';
    
    // Test basic property access
    const person = testData.validRecords.person;
    runner.assert(h.value.get(person, 'name') === 'John Doe', 'Should get simple property', testName);
    runner.assert(h.value.get(person, 'age') === 30, 'Should get number property', testName);
    runner.assert(h.value.get(person, '@type') === 'Person', 'Should get @type property', testName);
    
    // Test with default value
    runner.assert(h.value.get(person, 'nonexistent', 'default') === 'default', 'Should return default for nonexistent property', testName);
    
    // Test with nested object
    const nested = testData.validRecords.nestedRecord;
    runner.assert(h.value.get(nested, 'author.name') === 'Author Name', 'Should get nested property', testName);
    runner.assert(h.value.get(nested, 'author.worksFor.name') === 'Publisher Inc', 'Should get deeply nested property', testName);
    
    // Test with array access
    const org = testData.validRecords.organization;
    runner.assert(h.value.get(org, 'employees[0].name') === 'John Doe', 'Should get array element property', testName);
    runner.assert(h.value.get(org, 'employees[1].name') === 'Jane Smith', 'Should get second array element property', testName);
    
    // Test edge cases
    runner.assert(h.value.get(null, 'name') === undefined, 'Should handle null object', testName);
    runner.assert(h.value.get(undefined, 'name') === undefined, 'Should handle undefined object', testName);
    runner.assert(h.value.get(person, null) === person, 'Should return object for null path', testName);
    runner.assert(h.value.get(person, '') === person, 'Should return object for empty path', testName);
    runner.assert(h.value.get(person, 'nonexistent.deep') === undefined, 'Should handle nonexistent nested path', testName);
    
    // Test with array property
    const objWithArray = { items: ['a', 'b', 'c'] };
    runner.assert(h.value.get(objWithArray, 'items[0]') === 'a', 'Should get first array item', testName);
    runner.assert(h.value.get(objWithArray, 'items[2]') === 'c', 'Should get last array item', testName);
    runner.assert(h.value.get(objWithArray, 'items[5]') === undefined, 'Should handle out of bounds array access', testName);
    
    // Test complex path
    const complex = {
        data: {
            users: [
                { profile: { name: 'User1' } },
                { profile: { name: 'User2' } }
            ]
        }
    };
    runner.assert(h.value.get(complex, 'data.users[0].profile.name') === 'User1', 'Should handle complex path', testName);
}
