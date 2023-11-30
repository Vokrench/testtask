const pino = require('pino');

const logfile = pino.transport({
    target: 'pino/file',
    options: {destination: `./index.log`},
});

module.exports = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
        bindings: (bindings) => {
            return;
        },
        level: (label) => {
            return {type: label.toUpperCase()};
        },
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toLocaleString()}"`,
}, logfile);