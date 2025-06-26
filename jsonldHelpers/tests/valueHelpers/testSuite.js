
import { jsonldHelpers as h } from '../../jsonldHelpers.js';

export async function runValueHelperTests(runner) {
    console.log('\n--- Running Value Helper Tests ---');
    
    // Import all test modules
    const { testClean } = await import('./testClean.js');
    const { testUrlIsValid } = await import('./testUrlIsValid.js');
    const { testUrlToUrl } = await import('./testUrlToUrl.js');
    const { testEmailIsValid } = await import('./testEmailIsValid.js');
    const { testEmailToEmail } = await import('./testEmailToEmail.js');
    
    // Run all tests
    testClean(runner, h);
    testUrlIsValid(runner, h);
    testUrlToUrl(runner, h);
    testEmailIsValid(runner, h);
    testEmailToEmail(runner, h);
}
