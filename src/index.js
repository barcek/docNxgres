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

/* determine max number of listener processes */
const CPUs = os.cpus().length;
const multiplier = parseFloat(SVR.MULTIPLIER);
const maxListeners = Math.floor(CPUs * multiplier);

/* if initial process, fork new processes up to max; if new process, listen */
if (cluster.isMaster) {
    for (let i = 0; i < maxListeners; i++) {
        cluster.fork();
    };
} else {
    app.listen(SVR.PORT, () => {
        console.log(`App server process listening on port ${SVR.PORT}...`);
    });
};

/* handle listener exit */
cluster.on('exit', (process) => {
    console.log(`App server process ${process.id} exited.`);
    cluster.fork();
});
