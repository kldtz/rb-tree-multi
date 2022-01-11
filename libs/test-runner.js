/**
 * A simple test runner for small projects.
 */
const testsByPath = {}
let tests = [];

function test(name, fn) {
     tests.push({name, fn});
}

function run() {
    let failed = 0;
    let passed = 0;
    for (let path in testsByPath) {
        for (let t of testsByPath[path]) {
            try {
                t.fn();
                passed += 1;
                //console.log('✅', t.name, `(in ${path})`);
            } catch (e) {
                failed += 1;
                console.log('❌', t.name, `(in ${path})`);
                console.log(e.stack);
            }
        }
    }
    console.log("");
    summary(failed, passed);
}

function summary(failed, passed) {
    if (failed === 0) {
        console.log('✅', `All ${passed} tests passed!`)
    } else {
        console.log('❌', `${failed} out of ${failed + passed} tests failed!`);
    }
}

const testPaths = process.argv.slice(2);

global.test = test

for (let testPath of testPaths) {
    testsByPath[testPath] = [];
    tests = testsByPath[testPath];
    await import('.' + testPath);
}

run();
