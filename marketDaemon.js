var https = require('https');
var events = require('events');


var Liqui = require('node.liqui.io');
//all

var apiSecret = '83dd85b534b2371b8db5445510a8dd7115d11eb6e73a7db117812740833457c7';
var apiKey="4VNMI4N1-ZNNGVF7J-FYTZZ9RP-4TRCTLQ8-FP4L75I6";


let liqui = new Liqui(apiKey, apiSecret);




var MarketDaemon = (function () {
    var marketEmitter = new events.EventEmitter();
    marketEmitter.on('do', eventHandler);
    function MarketDaemon(parentDaemon) {
        var self = this;
        this.parentDaemon = parentDaemon;
        this.emit = function(a,b){
            marketEmitter.emit(a,b)
        }

    }




    return MarketDaemon;
})();

function eventHandler(data){
    switch(data.from){
        case 'arbitrage':
            trade(data);
            break;
        default:
            break;

    }
}


function trade(data){
    console.log();
    console.log("initiating trade");
    console.log(JSON.stringify(data));
    var params = data.params;
    switch(data.do){
        case 'buy':
            liqui.buy(params).then(function(result){
                console.log("successful buy with params " + JSON.stringify(data));
                console.log(JSON.stringify(result))
            });
            break;
        case 'sell':
            var tempParams = JSON.parse(JSON.stringify(params));
            var tempParams2 = JSON.parse(JSON.stringify(params));
            var tempParams3 = JSON.parse(JSON.stringify(params));
            tempParams.amount = params.amount;
            tempParams2.amount = params.amount*95;
            tempParams3.amount = params.amount*.05;

            setTimeout(sellIt,1000,tempParams);
            setTimeout(sellIt,2000,tempParams2);
            setTimeout(sellIt,2000,tempParams3);
            break;
    }
}
function sellIt(tempParams){
    liqui.sell(tempParams).then(function(result){
        console.log("successful sell with params " + JSON.stringify(tempParams));
        console.log(JSON.stringify(result))
    });
}

module.exports = {
    MarketDaemon: MarketDaemon
};