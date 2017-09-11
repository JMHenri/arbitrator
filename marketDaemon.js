var https = require('https');
var events = require('events');


var Liqui = require('node.liqui.io');
//all
var apiSecret = '88b28dcb154fd545b69c166012ac8aaa02535722313ebdf49f1788bee4e758d2'
var apiKey = 'HL5GQ4EO-TBWB8NI5-QVESEF9R-42J6LDNB-AGOLTELH'

// home
// var apiSecret = '99c53b66ae75db769714e03305b312cb4e2725e5b64c845fb286c82b45fb27cc';
// var apiKey = '5TU8KGT9-KHJDX1KB-Y6PPN02D-V4OS1LUW-M2OEAZU6';

// //lenio
// var apiSecret='c41e985a1af178823f9213e7cdf9febba54fa96d41f3cca53e4091a1d394767a'
// var apiKey='1A79T0T6-9VVNF43F-IOZGKJCZ-6F9SVTBI-JZL8CTQ5'


//eastern
// var apiSecret = '1003b5e2da6b59fb43e3a8c7c306d2347f93fec71b1e11e69b160073824cb75c';
// var apiKey = 'Z0WC7AWG-4M6TK8NR-FOMB0HNE-71F96C0T-RS7YZ5TJ';

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
            tempParams.amount = params.amount/2;
            liqui.sell(tempParams).then(function(result){
                console.log("successful sell with params " + JSON.stringify(tempParams));
                console.log(JSON.stringify(result))
            });
            setTimeout(sellIt,1000,tempParams);
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