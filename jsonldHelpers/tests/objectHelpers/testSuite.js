
import { jsonldHelpers as h } from '../../jsonldHelpers.js';
import { testData, deepCopy } from '../testData.js';

export async function runObjectHelperTests(runner) {
    console.log('\n--- Running Object Helper Tests ---');
    
    // Import all test modules
    const { testUuidNew } = await import('./testUuidNew.js');
    const { testNew } = await import('./testNew.js');
    const { testSetID } = await import('./testSetID.js');
    const { testClean } = await import('./testClean.js');
    const { testIsValid } = await import('./testIsValid.js');
    const { testRefGet } = await import('./testRefGet.js');
    const { testRefSet } = await import('./testRefSet.js');
    const { testTest } = await import('./testTest.js');
    const { testEq } = await import('./testEq.js');
    const { testLt } = await import('./testLt.js');
    const { testLe } = await import('./testLe.js');
    const { testGt } = await import('./testGt.js');
    const { testGe } = await import('./testGe.js');
    const { testIsSame } = await import('./testIsSame.js');
    const { testIsNull } = await import('./testIsNull.js');
    const { testDiff } = await import('./testDiff.js');
    const { testMerge } = await import('./testMerge.js');
    const { testFlatten } = await import('./testFlatten.js');
    const { testUnFlatten } = await import('./testUnFlatten.js');
    const { testChildrenGet } = await import('./testChildrenGet.js');
    const { testChildrenToRefs } = await import('./testChildrenToRefs.js');
    
    // Run all tests
    testUuidNew(runner, h);
    testNew(runner, h);
    testSetID(runner, h);
    testClean(runner, h);
    testIsValid(runner, h);
    testRefGet(runner, h);
    testRefSet(runner, h);
    testTest(runner, h);
    testEq(runner, h);
    testLt(runner, h);
    testLe(runner, h);
    testGt(runner, h);
    testGe(runner, h);
    testIsSame(runner, h);
    testIsNull(runner, h);
    testDiff(runner, h);
    testMerge(runner, h);
    testFlatten(runner, h);
    testUnFlatten(runner, h);
    testChildrenGet(runner, h);
    testChildrenToRefs(runner, h);
}
