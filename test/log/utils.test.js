/*
    Requirements
*/

const path = require('path');
const fs = require('fs').promises;

const assert = require('chai').assert;

const { vals, posInts } = require(path.resolve(__dirname, './log.test.js'));
const { createLogStream } = require(path.resolve(__dirname, '../../src/log/logstream.js'));
const { createLogUtils, addLogEntry } = require(path.resolve(__dirname, '../../src/log/utils.js'));

/*
    Assertions
*/

describe('createLogUtils', () => {

    it('is a function', () => {
        assert.typeOf(createLogUtils, 'function');
    });

    const posInt = posInts.next().value;
    const relativePathToLog = vals.log.path + vals.log.name + posInt;
    const createLogStreamResult = createLogStream(relativePathToLog);
    const createLogUtilsResult = createLogUtils(createLogStreamResult);

    it('creates an object', () => {
        assert.typeOf(createLogUtilsResult, 'object');
    });

    describe('.addLogEntry', () => {

        const createAddLogEntryResult = createLogUtilsResult.addLogEntry;

        it('is a function', () => {
            assert.typeOf(createAddLogEntryResult, 'function');
        });

        it('writes to the file in the log stream "path" attribute', async () => {
            await createAddLogEntryResult(vals.log.entry);
            const data = await fs.readFile(createLogStreamResult.path);
            const addLogEntryResult = data.toString();
            assert.equal(addLogEntryResult,
                `${(new Date).toUTCString()} ${vals.log.entry}\n`);
            fs.unlink(createLogStreamResult.path);
        });
    });
});
