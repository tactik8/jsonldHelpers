
import { jsonldHelpers as h } from '../../jsonldHelpers.js';

export async function runArrayHelperTests(runner) {
    console.log('\n--- Running Array Helper Tests ---');
    
    // Import all test modules
    const { testGet } = await import('./testGet.js');
    const { testSet } = await import('./testSet.js');
    const { testDelete } = await import('./testDelete.js');
    const { testAdd } = await import('./testAdd.js');
    const { testFilter } = await import('./testFilter.js');
    const { testSort } = await import('./testSort.js');
    const { testGetUniqueRefs } = await import('./testGetUniqueRefs.js');
    const { testDeduplicate } = await import('./testDeduplicate.js');
    const { testDiff } = await import('./testDiff.js');
    const { testConcat } = await import('./testConcat.js');
    const { testContains } = await import('./testContains.js');
    
    // Run all tests
    testGet(runner, h);
    testSet(runner, h);
    testDelete(runner, h);
    testAdd(runner, h);
    testFilter(runner, h);
    testSort(runner, h);
    testGetUniqueRefs(runner, h);
    testDeduplicate(runner, h);
    testDiff(runner, h);
    testConcat(runner, h);
    testContains(runner, h);
}
