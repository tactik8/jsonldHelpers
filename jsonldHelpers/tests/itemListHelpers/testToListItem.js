
import { testData } from '../testData.js';

export function testToListItem(runner, h) {
    const testName = 'itemListHelpers.toListItem';
    
    // Test converting regular record to list item
    const record = testData.validRecords.person;
    const listItem = h.itemList.toListItem(record);
    
    runner.assert(h.type.get(listItem) === 'ListItem', 'Should create ListItem type', testName);
    runner.assert(h.isValid(listItem), 'Should create valid JSON-LD object', testName);
    runner.assert(h.value.get(listItem, 'item') === record, 'Should contain original record as item', testName);
    
    // Test with already list item
    const existingListItem = {
        '@type': 'ListItem',
        '@id': 'list-item-1',
        'item': record
    };
    const result = h.itemList.toListItem(existingListItem);
    runner.assert(result === existingListItem, 'Should return same object if already ListItem', testName);
    
    // Test with null/undefined
    const nullResult = h.itemList.toListItem(null);
    runner.assert(h.type.get(nullResult) === 'ListItem', 'Should handle null input', testName);
    runner.assert(h.value.get(nullResult, 'item') === null, 'Should preserve null as item', testName);
    
    // Test with primitive values
    const stringItem = h.itemList.toListItem('test string');
    runner.assert(h.type.get(stringItem) === 'ListItem', 'Should handle string input', testName);
    runner.assert(h.value.get(stringItem, 'item') === 'test string', 'Should preserve string as item', testName);
    
    const numberItem = h.itemList.toListItem(42);
    runner.assert(h.type.get(numberItem) === 'ListItem', 'Should handle number input', testName);
    runner.assert(h.value.get(numberItem, 'item') === 42, 'Should preserve number as item', testName);
    
    // Test with complex object
    const complexObj = {
        nested: {
            data: 'value'
        },
        array: [1, 2, 3]
    };
    const complexItem = h.itemList.toListItem(complexObj);
    runner.assert(h.type.get(complexItem) === 'ListItem', 'Should handle complex object', testName);
    runner.assert(h.value.get(complexItem, 'item') === complexObj, 'Should preserve complex object as item', testName);
}
