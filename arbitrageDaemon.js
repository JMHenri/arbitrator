var request = require('request');
var liqui = "https://api.liqui.io/api/3/";
var depth = liqui + "depth/";
var info = liqui + "info/";
var ticker = liqui + "ticker/";



var ArbitrageDaemon = (function () {
    function ArbitrageDaemon(parentDaemon) {
        var self = this;
        this.currencyPairData = {};
        this.parentDaemon = parentDaemon;
        //altcoinlist
        this.secondaryCoinArray = [];
        this.currencyPairArray = [];
        this.currencyPairMegaString = '';
        this.coinInit(self);

        myVar = setInterval(this.tickerUpdate, 6000, self)
    }




    ArbitrageDaemon.prototype.stop = function () {
        return "No"
    };


    ArbitrageDaemon.prototype.coinInit = function(self){
        var reg = /(.*)(?=_btc)/g
        var options = {
            url: info,
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, cb);
        function cb(error, response, body) {
            var secondaryCoinArray = [];
            console.log('in cb')
            if (error) {
                self.parentDaemon.emit('error',error)
            }
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                for (var i in info.pairs) {
                    if (i !== 'eth_btc' && !(i.includes('usdt'))){
                        self.currencyPairArray.push(i)
                        var altCoin = i.match(reg)
                        if(altCoin != null){
                            self.secondaryCoinArray.push(i.match(reg)[0]);
                        }
                        if(self.currencyPairMegaString == ''){
                            self.currencyPairMegaString += i
                        }else{
                            self.currencyPairMegaString += '-' + i;
                        }
                    }
                }
            }
        }
    }


    ArbitrageDaemon.prototype.depthUpdate = function(self){
        var options = {
            url: depth + self.currencyPairMegaString + "?limit=15",
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, cb);
        function cb(error, response, body) {
            var secondaryCoinArray = [];
            if (error) {
                self.parentDaemon.emit('error',error)
            }
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                for (var i in info.pairs) {
                    if (i !== 'eth_btc' && !(i.includes('usdt')))
                        secondaryCoinArray.push(i)
                }
                analyzeResults(body, self)

            }
        }
    }


    ArbitrageDaemon.prototype.tickerUpdate = function(self){
        var options = {
            url: ticker + self.currencyPairMegaString,
            headers: {
                'User-Agent': 'request'
            }
        };
        console.log('in ticker update, self is ', self)

        request(options, cb);
        function cb(error, response, body) {
            console.log('in res')
            if (error) {
                console.log("error " , error)
                self.parentDaemon.emit('error',error)
            }
            if (!error && response.statusCode == 200) {
                analyzeResults(body, self)

            }
        }
    }



    return ArbitrageDaemon;
}());

module.exports = {ArbitrageDaemon:ArbitrageDaemon}


function analyzeResults(body, self){
    body = JSON.parse(body);
    console.log("in analyze");
    var coinOfAnalysis = 'dnt';

    //rename from dntCoins to coinPairings and throw to a pair analyzer
    dntCoins = [];
    for(var i in body){
        if (i.includes('dnt')){
            //.coin is an extra added parameter to keep data in when throwing singleton data sets to next function.
            //using singleton dataset w/o name because ripping out object and keeping name is hard to do syntactically
            body[i].coin=i;
            dntCoins.push(body[i])
        }
    }
    //usdt conversion should actually take all pairs not just one
    usdPair = usdtConversion([dntCoins],self);
    pairComparator(dntCoins, self)
    self.parentDaemon.emit('do', {
        to:'market',
        from:'arbitrage',
        do:'buy',
        params:{
            currencyPair:'omg_eth',
            amount:'.1',
            rate:'0.1'
        }
    })
}

function usdtConversion(coinPairings,self){
    console.log('in usdt conversion')
}

function pairComparator(pair, self){
    console.log(pair)
}