/**
 * Created by Jake-o on 8/17/2017.
 */
var events = require('events');
var primaryCoinPrice = require('./PrimaryCoinPriceDaemon.js');
var loginManager = require('./loginManager');
var arbitrage = require('./arbitrageDaemon.js');
var market = require('./marketDaemon.js');
var Liqui = require('node.liqui.io');


var apiSecret = '83dd85b534b2371b8db5445510a8dd7115d11eb6e73a7db117812740833457c7';
var apiKey="4VNMI4N1-ZNNGVF7J-FYTZZ9RP-4TRCTLQ8-FP4L75I6";




var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/logs/main.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(d + ' ' + Date.now() + '\n');
    log_stdout.write(d + ' ' + Date.now() + '\n');
};






let liqui = new Liqui(apiKey, apiSecret);


var daemonManagementEmitter;

//Assign the eventhandler to an event:
var eventEmitter = new events.EventEmitter();
eventEmitter.on('do', forwardMessage);


process.on('unhandledRejection', (reason) => {
    console.log("CRITICAL ERROR")
    console.log('Reason: ' + JSON.stringify(reason));
});



var coinDepthList = {
    eth_omg: []
};

var arbitrageDaemon;
var marketDaemon;
var primaryCoinPriceDaemon;
function setup() {
    startEmitters();
}
function startEmitters() {
    primaryCoinPriceDaemon = new primaryCoinPrice.PrimaryCoinPriceDaemon(eventEmitter);
    marketDaemon = new market.MarketDaemon(eventEmitter,primaryCoinPriceDaemon);
    arbitrageDaemon = new arbitrage.ArbitrageDaemon(eventEmitter);
}

function forwardMessage(data){
    switch(data.to){
        case 'arbitrageAnalyzer':
            arbitrageDaemon.emit('do', data);
            break;
        case 'market':
            marketDaemon.emit('do', data);
        default:
            break;

    }
}


function updatePriceList(currencyUpdate){
    coinDepthList.currencyUpdate.currencyPair = currencyUpdate.currencyPairData;
}

setup();
