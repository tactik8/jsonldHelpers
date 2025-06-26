
// Test Suite Orchestrator
import { runObjectHelperTests } from './objectHelpers/testSuite.js';
import { runArrayHelperTests } from './arrayHelpers/testSuite.js';
import { runPropertyHelperTests } from './propertyHelpers/testSuite.js';
import { runValueHelperTests } from './valueHelpers/testSuite.js';
import { runItemListHelperTests } from './itemListHelpers/testSuite.js';

class TestRunner {
    constructor() {
        this.results = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    assert(condition, message, testName) {
        this.totalTests++;
        const result = {
            test: testName,
            message: message,
            passed: condition,
            timestamp: new Date().toISOString()
        };
        
        if (condition) {
            this.passedTests++;
            console.log(`✓ ${testName}: ${message}`);
        } else {
            this.failedTests++;
            console.error(`✗ ${testName}: ${message}`);
        }
        
        this.results.push(result);
        return condition;
    }

    assertEqual(actual, expected, message, testName) {
        const condition = JSON.stringify(actual) === JSON.stringify(expected);
        return this.assert(condition, `${message} - Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`, testName);
    }

    assertThrows(fn, message, testName) {
        try {
            fn();
            return this.assert(false, `${message} - Expected function to throw`, testName);
        } catch (e) {
            return this.assert(true, `${message} - Function threw as expected: ${e.message}`, testName);
        }
    }

    displayResults() {
        const resultsDiv = document.getElementById('test-results');
        if (!resultsDiv) return;

        const summary = document.createElement('div');
        summary.className = 'summary';
        summary.innerHTML = `
            <h2>Test Summary</h2>
            <p>Total: ${this.totalTests} | Passed: ${this.passedTests} | Failed: ${this.failedTests}</p>
            <p>Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%</p>
        `;
        resultsDiv.appendChild(summary);

        this.results.forEach(result => {
            const div = document.createElement('div');
            div.className = `test-result ${result.passed ? 'passed' : 'failed'}`;
            div.innerHTML = `<strong>${result.test}:</strong> ${result.message}`;
            resultsDiv.appendChild(div);
        });
    }
}

export async function runAllTests() {
    const runner = new TestRunner();
    
    console.log('Starting JsonLD Helpers Test Suite...');
    
    // Run all test suites
    await runObjectHelperTests(runner);
    await runArrayHelperTests(runner);
    await runPropertyHelperTests(runner);
    await runValueHelperTests(runner);
    await runItemListHelperTests(runner);
    
    console.log(`\nTest Suite Complete: ${runner.passedTests}/${runner.totalTests} passed`);
    runner.displayResults();
    
    return runner.results;
}
