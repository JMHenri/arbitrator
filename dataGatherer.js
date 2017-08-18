var https = require('https');
var request = require('request');

var liqui = "https://api.liqui.io/api/3/";
var depth = liqui + "depth/";
var info = liqui + "info/";



module.exports = {
    getSecondaryCoinArray: getSecondaryCoinArray,
    depthUpdater:depthUpdater
};


function depthUpdater(currencyPair, eventEmitter) {
    this.x = info;
    var currencyPairData = {};
    this.makeRequest = function () {



        eventEmitter.emit('depthUpdate', {currencyPair:currencyPair,
        currencyPairData: currencyPairData})
    }
}


function getSecondaryCoinArray() {
    var options = {
        url: info,
        headers: {
            'User-Agent': 'request'
        }
    };
    var secondaryCoinArray = [];

    request(options, cb);
    function cb(error, response, body) {
        if (error) {
            next(error)
        }
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            for (var i in info.pairs) {
                if (i !== 'eth_btc' && !(i.includes('usdt')))
                    secondaryCoinArray.push(i)
            }
        }
    }

    console.log(secondaryCoinArray)
    return secondaryCoinArray;
}
