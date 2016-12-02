/**
 * Created by dx.yang on 2016/11/30.
 */


const baseRequest = require('./BaseRequest');
const lodash = require('lodash');
const querystring = require('querystring');
const crypto = require('crypto');

const xqUrls = {
    csrf: 'https://xueqiu.com/service/csrf?api=/user/login',
    login: 'https://xueqiu.com/user/login',
    stockList: 'https://xueqiu.com/stock/cata/stocklist.json',
    stockDetail: 'https://xueqiu.com/v4/stock/quote.json',
    stockDataForChart: 'https://xueqiu.com/stock/forchart/stocklist.json'
    // https://xueqiu.com/stock/forchart/stocklist.json?symbol=BABA&period=1d&one_min=1&_=1480604635615
};

function getChartData(symbol, period) {
    let params = `symbol=${symbol}&period=${period}&one_min=1&_=${new Date() * 1}`;
    let apiUrl = xqUrls.stockDataForChart + '?' + params;
    return new Promise((resolve, reject) => {
        baseRequest.get(apiUrl, (err, resp, data) => {
            if (err) {
                reject(err);
            } else {
                data = JSON.parse(data);
                resolve(data)
            }
        });
    });
}

function init(telephone, password) {
    let login_params = {
        telephone,
        remember_me: 'on',
        areacode: '86'
    };

    let md5 = crypto.createHash('md5');
    md5.update(password);

    login_params.password = md5.digest('hex').toUpperCase();
    return new Promise((resolve, reject) => {
        baseRequest.get(xqUrls.csrf, (e, r) => {
            if (e) {
                console.log(e);
                return
            }
            baseRequest.post({
                url: xqUrls.login,
                form: login_params
            }, (err, resp) => {
                if (err || resp.statusCode >= 400) {
                    console.log('xueqiu login failed');
                    reject(1);
                    return
                }
                console.log('xueqiu login success');
                resolve(0)
            });
        });
    });
}

function getBaseList(params) {
    params = lodash.assign({
        page: 1,
        size: 100,
        order: 'asc',
        orderby: 'code',
        type: '1,2',
        _: new Date() * 1
    }, params);
    let qs = querystring.stringify(params);
    let apiUrl = xqUrls.stockList + '?' + qs;
    return new Promise((resolve, reject) => {
        baseRequest.get(apiUrl, (err, resp, body) => {
            if (err) {
                reject(err);
                return;
            }
            body = JSON.parse(body);
            resolve(body);
        });
    });
}

async function getList() {
    let total = 1;
    let count = 0;
    let page = 1;
    let size = 100;

    let stocks = [];
    while (count < total) {
        let data = await getBaseList({page, size});
        let list = lodash.get(data, 'stocks');
        lodash.forEach(list, (d) => {
            if (d.code) {
                stocks.push(d);
            }
        });
        total = lodash.get(data, 'count.count');
        count = count + size;
        let less = total - count;
        if (size > less) {
            size = less;
        }
        page += 1;
        console.log('get list from xueqiu: ', page);
    }
    console.log('get list from xueqiu done');
}


module.exports = {
    init,
    getChartData
};