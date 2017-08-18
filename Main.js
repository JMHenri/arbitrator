/**
 * Created by Jake-o on 8/17/2017.
 */
var events = require('events');
var data = require('./dataGatherer.js');
var loginManager = require('./loginManager');
var eventEmitter = new events.EventEmitter();



//Assign the eventhandler to an event:
eventEmitter.on('setupFinished', startListeningForArbitrage);
eventEmitter.on('depthUpdate', analyzeArbitrage);



var coinDepthList = {
    eth_omg: []
};

function setup() {
    async.waterfall([
        loginManager.login
    ], function (err, result) {
        if (err) {
            console.log("err: ", err)
        }
        eventEmitter.emit('setupFinished');
        console.log(secondaryCoinArray)
    });
}

function startListeningForArbitrage() {
    var depthUpdater = new data.depthUpdater('eth_omg', eventEmitter);
}
function analyzeArbitrage(currencyPairData){
    updatePriceList(currencyPairData)

}
function updatePriceList(currencyPairData){
    coinDepthList.currencyPairData
}

//setup();


