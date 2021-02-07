 /*
    Requirements
*/

const path = require('path');
const os = require('os');
const cluster = require('cluster');

const { SVR } = require(path.resolve(__dirname, './config'));
const app = require(path.resolve(__dirname, 'app.js'));

/*
    Process creation
*/

const CPUs = os.cpus().length;
const multiplier = parseFloat(SVR.MULTIPLIER);
const maxProcesses = Math.floor(CPUs * multiplier);

if (cluster.isMaster) {
    for (let i = 0; i < maxProcesses; i++) {
        cluster.fork();
    };
} else {
    app.listen(SVR.PORT, () => { console.log(`App listening on port ${SVR.PORT}...`); });
};

cluster.on('exit', (process) => {
    console.log(`App ${process.id} down.`);
    cluster.fork();
});
