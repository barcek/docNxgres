/*
    Requirements
*/

const path = require('path');

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

const { pool } = require(path.resolve(__dirname, '../src/db/pool.js'));
const app = require(path.resolve(__dirname, '../src/app.js'));

/*
    Plugins
*/

chai.use(chaiHttp);

/*
    Test values
*/

const csurfTokenMatch = /(?<=name\=\"_csrf\" value=\").*?(?=\")/;

const entryValue = 'test entry';

const createResultMatch = /Entry [\w\s]*? added to database with id \d+/;
const readAllResultMatch = /Database contains entries:\s+(\d+ .*?)*/;

const deleteAllResult = 'Database contains no entries.';

/*
    Assertions
*/

describe('app', async () => {

    const agent = chai.request.agent(app);
    const res = await agent.get('/')

    expect(res).to.have.cookie('_csrf');
    const getRootResultCsurfToken = res.text.match(csurfTokenMatch);

    describe('GET /', () => {

        it('it returns HTML including a csurf token', () => {

            expect(res).to.have.status(200);
            expect(res.type).to.be.eql('text/html');
            expect(res.text).to.contain('name="_csrf"');
        });
    });

    describe('POST /entries', () => {

        it('it returns confirmation that an entry has been added to the database ' +
            'with a numerical id', () => {

            return agent
                .post('/entries')
                .set('CSRF-Token', getRootResultCsurfToken)
                .send({ entry: entryValue })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.result.string).to.match(createResultMatch);
                    expect(res.body.result.isError).to.be.eql(false);
                });
        });
    });

    describe('GET /entries', () => {

        it('it returns a string containing a list of database entries, ' +
            'each with a numerical id', () => {

            return agent
                .get('/entries')
                .set('CSRF-Token', getRootResultCsurfToken)
                .send({ entry: entryValue })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.result.string).to.match(readAllResultMatch);
                    expect(res.body.result.isError).to.be.eql(false);
                });
        });
    });

    describe('DELETE /entries', () => {

        it('it returns confirmation that every database entry has been deleted', () => {

            return agent
                .delete('/entries')
                .set('CSRF-Token', getRootResultCsurfToken)
                .send({ entry: entryValue })
                .then(res => {
                    expect(res).to.have.status(200);
                    expect(res.body.result.string).to.eql(deleteAllResult);
                    expect(res.body.result.isError).to.be.eql(false);
                });
        });
    });

    after('API calls - close', () => {
        agent.close();
    });
});

after('all tests - end', () => {
    pool.end();
});
