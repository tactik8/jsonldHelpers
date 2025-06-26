
import { jsonldHelpers as h } from '../../jsonldHelpers.js';

export async function runItemListHelperTests(runner) {
    console.log('\n--- Running Item List Helper Tests ---');
    
    // Import all test modules
    const { testToListItem } = await import('./testToListItem.js');
    const { testToList } = await import('./testToList.js');
    const { testLength } = await import('./testLength.js');
    const { testGetListItem } = await import('./testGetListItem.js');
    const { testFilterListItems } = await import('./testFilterListItems.js');
    const { testCleanListObject } = await import('./testCleanListObject.js');
    const { testResetPosition } = await import('./testResetPosition.js');
    const { testDeleteListItem } = await import('./testDeleteListItem.js');
    const { testInsertListItem } = await import('./testInsertListItem.js');
    const { testAppend } = await import('./testAppend.js');
    const { testPrepend } = await import('./testPrepend.js');
    
    // Run all tests
    testToListItem(runner, h);
    testToList(runner, h);
    testLength(runner, h);
    testGetListItem(runner, h);
    testFilterListItems(runner, h);
    testCleanListObject(runner, h);
    testResetPosition(runner, h);
    testDeleteListItem(runner, h);
    testInsertListItem(runner, h);
    testAppend(runner, h);
    testPrepend(runner, h);
}
