/**
 * Created by Jake-o on 8/17/2017.
 */
var events = require('events');
var primaryCoinPrice = require('./PrimaryCoinPriceDaemon.js');
var loginManager = require('./loginManager');
var arbitrage = require('./arbitrageDaemon.js');
var market = require('./marketDaemon.js');
var Liqui = require('node.liqui.io');

var apiSecret = '99c53b66ae75db769714e03305b312cb4e2725e5b64c845fb286c82b45fb27cc';
var apiKey = '5TU8KGT9-KHJDX1KB-Y6PPN02D-V4OS1LUW-M2OEAZU6';

let liqui = new Liqui(apiKey, apiSecret);


var daemonManagementEmitter;

//Assign the eventhandler to an event:
var eventEmitter = new events.EventEmitter();
eventEmitter.on('do', forwardMessage);


process.on('unhandledRejection', (reason) => {
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
