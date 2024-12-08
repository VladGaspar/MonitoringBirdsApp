const { apiPaths } = require('../../src/api/apiPaths');

const getExactPath = (path) => `**${path}`;
const getMatchingPath = (path) => `**${path}**`;

module.exports = {
    getExactPath,
    getMatchingPath
};
