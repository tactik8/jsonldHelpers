
// Simple Jest-like test runner for browser environment
class TestRunner {
    constructor() {
        this.tests = [];
        this.currentSuite = null;
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0
        };
    }

    describe(name, fn) {
        const previousSuite = this.currentSuite;
        this.currentSuite = { name, tests: [], beforeEach: null, afterEach: null };
        fn();
        this.tests.push(this.currentSuite);
        this.currentSuite = previousSuite;
    }

    test(name, fn) {
        if (this.currentSuite) {
            this.currentSuite.tests.push({ name, fn, type: 'test' });
        }
    }

    beforeEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.beforeEach = fn;
        }
    }

    afterEach(fn) {
        if (this.currentSuite) {
            this.currentSuite.afterEach = fn;
        }
    }

    expect(actual) {
        return {
            toBe: (expected) => {
                if (actual !== expected) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                }
            },
            toEqual: (expected) => {
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeDefined: () => {
                if (actual === undefined) {
                    throw new Error(`Expected value to be defined, but got undefined`);
                }
            },
            toBeUndefined: () => {
                if (actual !== undefined) {
                    throw new Error(`Expected value to be undefined, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeNull: () => {
                if (actual !== null) {
                    throw new Error(`Expected value to be null, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeTruthy: () => {
                if (!actual) {
                    throw new Error(`Expected value to be truthy, but got ${JSON.stringify(actual)}`);
                }
            },
            toBeFalsy: () => {
                if (actual) {
                    throw new Error(`Expected value to be falsy, but got ${JSON.stringify(actual)}`);
                }
            },
            toMatch: (regex) => {
                if (!regex.test(actual)) {
                    throw new Error(`Expected ${JSON.stringify(actual)} to match ${regex}`);
                }
            },
            toHaveLength: (length) => {
                if (actual.length !== length) {
                    throw new Error(`Expected length ${length}, but got ${actual.length}`);
                }
            },
            toContain: (item) => {
                if (!actual.includes(item)) {
                    throw new Error(`Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`);
                }
            },
            toThrow: (message) => {
                try {
                    actual();
                    throw new Error(`Expected function to throw, but it didn't`);
                } catch (error) {
                    if (message && !error.message.includes(message)) {
                        throw new Error(`Expected error message to include "${message}", but got "${error.message}"`);
                    }
                }
            },
            not: {
                toBe: (expected) => {
                    if (actual === expected) {
                        throw new Error(`Expected ${JSON.stringify(actual)} not to be ${JSON.stringify(expected)}`);
                    }
                },
                toEqual: (expected) => {
                    if (JSON.stringify(actual) === JSON.stringify(expected)) {
                        throw new Error(`Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`);
                    }
                },
                toBeNull: () => {
                    if (actual === null) {
                        throw new Error(`Expected value not to be null`);
                    }
                },
                toContain: (item) => {
                    if (actual.includes(item)) {
                        throw new Error(`Expected ${JSON.stringify(actual)} not to contain ${JSON.stringify(item)}`);
                    }
                }
            }
        };
    }

    async runTests() {
        this.results = { passed: 0, failed: 0, skipped: 0, total: 0 };
        const output = document.getElementById('test-results');
        const progressBar = document.querySelector('.progress-bar');
        
        let totalTests = 0;
        let completedTests = 0;
        
        // Count total tests
        this.tests.forEach(suite => {
            totalTests += suite.tests.length;
        });
        
        for (const suite of this.tests) {
            output.innerHTML += `\n📁 ${suite.name}\n`;
            
            for (const test of suite.tests) {
                this.results.total++;
                
                try {
                    if (suite.beforeEach) {
                        await suite.beforeEach();
                    }
                    
                    await test.fn();
                    
                    if (suite.afterEach) {
                        await suite.afterEach();
                    }
                    
                    output.innerHTML += `  ✅ ${test.name}\n`;
                    this.results.passed++;
                } catch (error) {
                    output.innerHTML += `  ❌ ${test.name}\n    ${error.message}\n`;
                    this.results.failed++;
                }
                
                completedTests++;
                const progress = (completedTests / totalTests) * 100;
                progressBar.style.width = `${progress}%`;
                
                // Allow UI to update
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        
        this.showSummary();
    }

    showSummary() {
        const summary = document.getElementById('test-summary');
        const content = document.getElementById('summary-content');
        
        const { passed, failed, skipped, total } = this.results;
        const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
        
        content.innerHTML = `
            <div class="row">
                <div class="col-md-3"><strong>Total:</strong> ${total}</div>
                <div class="col-md-3 text-success"><strong>Passed:</strong> ${passed}</div>
                <div class="col-md-3 text-danger"><strong>Failed:</strong> ${failed}</div>
                <div class="col-md-3"><strong>Pass Rate:</strong> ${passRate}%</div>
            </div>
        `;
        
        summary.className = failed > 0 ? 'alert alert-danger' : 'alert alert-success';
        summary.classList.remove('d-none');
    }
}

const testRunner = new TestRunner();

// Make global functions available
window.describe = testRunner.describe.bind(testRunner);
window.test = testRunner.test.bind(testRunner);
window.beforeEach = testRunner.beforeEach.bind(testRunner);
window.afterEach = testRunner.afterEach.bind(testRunner);
window.expect = testRunner.expect.bind(testRunner);

// Import all test files
const testFiles = [
    './objectHelpers/generateUUIDv4.test.js',
    './objectHelpers/thing.test.js',
    './objectHelpers/setID.test.js',
    './objectHelpers/isJsonldObject.test.js',
    './objectHelpers/getRef.test.js',
    './objectHelpers/setRef.test.js',
    './objectHelpers/meetsFilterParams.test.js',
    './objectHelpers/comparisons.test.js',
    './objectHelpers/isSame.test.js',
    './objectHelpers/isNull.test.js',
    './objectHelpers/diff.test.js',
    './objectHelpers/mergeRecords.test.js',
    './objectHelpers/clean.test.js',
    './objectHelpers/nestedRecords.test.js',
    './objectHelpers/flatten.test.js'
];

export async function runAllTests() {
    // Import all test files
    for (const file of testFiles) {
        try {
            await import(file);
        } catch (error) {
            console.error(`Failed to import ${file}:`, error);
            document.getElementById('test-results').innerHTML += `Failed to load ${file}: ${error.message}\n`;
        }
    }
    
    // Run all tests
    await testRunner.runTests();
}
