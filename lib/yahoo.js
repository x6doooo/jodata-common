/**
 * Created by dx.yang on 2016/12/1.
 */


const baseRequest = require('./baseRequest');

//http://query1.finance.yahoo.com/v8/finance/chart/BABA?interval=1m&range=365d
const hosts = [
    'http://query1.finance.yahoo.com',
    'http://query2.finance.yahoo.com'
];

function req(theUrl, cb) {
    baseRequest({
        method: 'GET',
        url: theUrl,
        gzip: true,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like' +
            ' Gecko) Chrome/54.0.2840.98 Safari/537.36',
            Host: 'query1.finance.yahoo.com',
            Connection: 'keep-alive',
            Pragma: 'no-cache',
            'Cache-Control': 'no-cache',
            'Upgrade-Insecure-Requests': 1,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Accept-Language': 'zh-CN,zh;q=0.8'
        },
    }, cb)
}

function get(code, interval, range) {
    let apiUrl = `${hosts[0]}/v8/finance/chart/${code}?interval=${interval}&range=${range}`;
    console.log('yahoo request: ', apiUrl);
    return new Promise((resolve, reject) => {
        req(apiUrl, (err, resp, body) => {
            if (err) {
                let apiUrl = `${hosts[1]}/v8/finance/chart/${code}?interval=${interval}&range=${range}`;
                console.log('yahoo request: ', apiUrl);
                req(apiUrl, (err, resp, body) => {
                    if (err) {
                        reject('fail');
                        return;
                    }
                    resolve(body);
                });
                return;
            }
            resolve(body);
        });
    });
}


module.exports = {
    get
}