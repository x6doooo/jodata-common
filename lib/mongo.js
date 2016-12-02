/**
 * Created by dx.yang on 2016/12/2.
 */


const mongoDB = require('mongodb');

function init(addr, option) {
    return new Promise((resolve, reject) => {
        let MongoClient = mongoDB.MongoClient;
        MongoClient.connect(addr, option, function(err, database) {
            if(err) {
                reject(err);
                return
            }
            resolve(database);
        });
    });
}

module.exports = {
    init
};