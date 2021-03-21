/*
    Requirements
*/

const path = require('path');
const fs = require('fs').promises;

const assert = require('chai').assert;

const { vals, posInts } = require(path.resolve(__dirname, './log.test.js'));
const { createLogStream, logStream } = require(path.resolve(__dirname, '../../src/log/logstream.js'));

/*
    Assertions
*/

describe('createLogStream', () => {

    const posInt = posInts.next().value;
    const relativePathToLog = vals.log.path + vals.log.name + posInt;
    const createLogStreamResult = createLogStream(relativePathToLog);

    it('creates an object', () => {
        assert.typeOf(createLogStreamResult, 'object');
    });

    it('provides a "path" attribute including the filename passed', () => {
        assert.include(createLogStreamResult.path, vals.log.name);
    });

    const pathToLog = path.resolve(__dirname, vals.log.name + posInt);

    it('allows for the file in the "path" attribute to be written', async () => {
        await createLogStreamResult.write(vals.log.entry);
        const data = await fs.readFile(pathToLog);
        const createLogStreamWriteResult = data.toString();
        assert.equal(createLogStreamWriteResult, vals.log.entry);
        fs.unlink(pathToLog);
    });
});

describe('logStream', () => {

    it('is an object', () => {
        assert.typeOf(logStream, 'object');
    });

    it('has a "path" attribute with no segment undefined', () => {
        assert.notInclude(logStream.path, 'undefined');
    });
});
