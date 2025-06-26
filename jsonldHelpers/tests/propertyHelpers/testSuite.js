
import { jsonldHelpers as h } from '../../jsonldHelpers.js';

export async function runPropertyHelperTests(runner) {
    console.log('\n--- Running Property Helper Tests ---');
    
    // Import all test modules
    const { testKeys } = await import('./testKeys.js');
    const { testTypeGet } = await import('./testTypeGet.js');
    const { testTypeSet } = await import('./testTypeSet.js');
    const { testIdGet } = await import('./testIdGet.js');
    const { testIdSet } = await import('./testIdSet.js');
    const { testValueGet } = await import('./testValueGet.js');
    const { testValueSet } = await import('./testValueSet.js');
    const { testValueAdd } = await import('./testValueAdd.js');
    const { testValueDelete } = await import('./testValueDelete.js');
    const { testValuesGet } = await import('./testValuesGet.js');
    
    // Run all tests
    testKeys(runner, h);
    testTypeGet(runner, h);
    testTypeSet(runner, h);
    testIdGet(runner, h);
    testIdSet(runner, h);
    testValueGet(runner, h);
    testValueSet(runner, h);
    testValueAdd(runner, h);
    testValueDelete(runner, h);
    testValuesGet(runner, h);
}
