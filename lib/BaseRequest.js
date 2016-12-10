/**
 * Created by dx.yang on 2016/12/2.
 */

const request = require('request');

let baseRequest = request.defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
    },
    timeout: 7000,
    jar: true,
    pool: {
        maxSockets: Infinity
    }
});

baseRequest.debug = true;

module.exports = baseRequest;
