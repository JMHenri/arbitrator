var request = require('request');
var liqui = "https://api.liqui.io/api/3/";
var depth = liqui + "depth/";
var info = liqui + "info/";
var ticker = liqui + "ticker/";
var primaryCoinPriceDaemon = require('./PrimaryCoinPriceDaemon.js');

var PrimaryCoinPriceDaemon = new primaryCoinPriceDaemon.PrimaryCoinPriceDaemon;

var blah;
var ArbitrageDaemon = (function () {
    function ArbitrageDaemon(parentDaemon) {
        var self = this;
        blah = this;
        this.currencyPairData = {};
        this.parentDaemon = parentDaemon;
        //altcoinlist
        this.secondaryCoinArray = [];
        this.currencyPairArray = [];
        this.currencyPairMegaString = '';
        this.coinInit(self);

        myVar = setInterval(this.tickerUpdate, 6000, self)
    }



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





    ArbitrageDaemon.prototype.tickerUpdate = function(self){
        var options = {
            url: ticker + self.currencyPairMegaString,
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, cb);
        function cb(error, response, body) {
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

/*
take in a ticker and handles the all main functional features
 */
function analyzeResults(body, self){
    body = JSON.parse(body);
    var coins = ['1st', 'adx','ae','bat','cvc','dash', 'dnt','edg','eos', 'gnt','ltc','mgo','omg', 'round','sngls', 'snm', 'stx', 'tnt','vdg','zrx'];

    //rename from dntCoins to coinPairings and throw to a pair analyzer
    coinPairList = {};

    for(var i in body){
        for (var j in coins) {
            if (i.includes(coins[j])) {
                if (i.includes('eth')) {
                    if (coinPairList[coins[j]] == undefined) {
                        coinPairList[coins[j]] = {};
                    }
                    coinPairList[coins[j]].eth = body[i];
                }
                if(i.includes('btc')){
                    if(coinPairList[coins[j]] == undefined){
                        coinPairList[coins[j]] = {};
                    }
                    coinPairList[coins[j]].btc = body[i];
                }
            }
        }
    }



    //usdt conversion should actually take all pairs not just one
    fillHandSet(coinPairList)
    usdPair = usdtConversion(coinPairList,self);

    if(usdPair == undefined){
        return
    }

    var profitableTrades = pairComparator(usdPair, self);
    if(profitableTrades.length>0){
        for(var i in profitableTrades){

            var requestData = createAndSendMarketRequests(profitableTrades[i]);
        }
    }

}


function createAndSendMarketRequests(dataIn){
    var data = [dataIn]
    var options = {
        url: depth + data[0].buy + '-' + data[0].sell + "?limit=15",
        headers: {
            'User-Agent': 'request'
        }
    };

    request(options, cb);
    function cb(error, response, body, extra) {
        var bodyIn = JSON.parse(body)
        var usdPrices = JSON.parse(JSON.stringify(bodyIn));
        for (var i in usdPrices){
            for(var j in usdPrices[i]){
                for(var k in usdPrices[i][j]){
                    if(i.includes('btc')){
                        usdPrices[i][j][k][0] = usdPrices[i][j][k][0] * PrimaryCoinPriceDaemon.getBitcoinPrice();
                    }else if (i.includes('eth')){
                        usdPrices[i][j][k][0] = usdPrices[i][j][k][0] * PrimaryCoinPriceDaemon.getEthereumPrice();

                    }
                }
            }
        }

        if(usdPrices.error == undefined){
            var amountToBuy = figureOutHowMuchToBuyAndSell(usdPrices,data);

            requestTrade(amountToBuy, data);
            if (error) {

            }
            if (!error && response.statusCode == 200) {

            }
        }

    }
}

function figureOutHowMuchToBuyAndSell(usdPrices, data){
    console.log("data for new trade is " + JSON.stringify(data));
    console.log("according to preliminary guesses, ratio is " + usdPrices[data[0].sell].bids[0][0]/usdPrices[data[0].buy].asks[0][0]);

    //dollas

    var amountToBuy = applyDollarPriceAndReturnPotentialDepth(1, usdPrices, data);
    return amountToBuy;
}
/*
data is
[
buy: PAIR
sell: PAIR
]
 */
function applyDollarPriceAndReturnPotentialDepth(dollarPrice, usdPrices, data) {
    var dollarPrice = 0;
    while(dollarPrice < 50){
        dollarPrice +=1;
        var dollarsLeft = dollarPrice;
        var sellDollarsLeft = dollarPrice;
        var virtualDepth = JSON.parse(JSON.stringify(usdPrices));
        //dictates the amount field when this is complete
        var buyAmount = 0;


        while(dollarsLeft > 0.1){
            temporaryBuyAmout = dollarsLeft / virtualDepth[data[0].buy].asks[0][0];
            if(temporaryBuyAmout >= virtualDepth[data[0].buy].asks[0][1]){
                temporaryBuyAmout -= virtualDepth[data[0].buy].asks[0][1];
                dollarsLeft = dollarsLeft - (virtualDepth[data[0].buy].asks[0][1] * virtualDepth[data[0].buy].asks[0][0]);
                buyAmount += virtualDepth[data[0].buy].asks[0][1];
                virtualDepth[data[0].buy].asks.splice(0,1);

            }else if((temporaryBuyAmout < virtualDepth[data[0].buy].asks[0][1])) {
                dollarsLeft -= dollarsLeft;
                buyAmount += temporaryBuyAmout;
                virtualDepth[data[0].buy].asks[0][1] -= temporaryBuyAmout;

            }

            if(dollarsLeft > 0.1){

                continue;
            }else if (dollarsLeft <= 0.1){
            };
        }

        while(sellDollarsLeft > 0.1){
            temporarySellAmount = sellDollarsLeft / virtualDepth[data[0].sell].bids[0][0];
            if(temporarySellAmount >= virtualDepth[data[0].sell].bids[0][1]){
                temporarySellAmount -= virtualDepth[data[0].sell].bids[0][1];
                sellDollarsLeft = sellDollarsLeft - (virtualDepth[data[0].sell].bids[0][1] * virtualDepth[data[0].sell].bids[0][0]);
                virtualDepth[data[0].sell].bids.splice(0,1);

            }else if((temporarySellAmount < virtualDepth[data[0].sell].bids[0][1])) {
                sellDollarsLeft -= sellDollarsLeft;
                virtualDepth[data[0].buy].asks[0][1] -= temporarySellAmount;
            }

            if(sellDollarsLeft > 0.1){
                continue;
            }else if (sellDollarsLeft <= 0.1){

            };
        }
        if(((virtualDepth[data[0].sell].bids[0][0]/virtualDepth[data[0].buy].asks[0][0]) < 1.0093)){
            console.log('buy data is figured out, the final ratio is ' + virtualDepth[data[0].sell].bids[0][0]/virtualDepth[data[0].buy].asks[0][0])
            break;
        }
        else{
            continue;
        }
    }
    console.log("buying " + dollarPrice + " dollars")
    return buyAmount
}

function usdtConversion(data,self){
    var coinPairings = JSON.parse(JSON.stringify(data));
    if(PrimaryCoinPriceDaemon.getBitcoinPrice() == undefined || PrimaryCoinPriceDaemon.getEthereumPrice() == undefined){
        return null
    }
    for(var i in coinPairings){
        for(var j in coinPairings[i].btc){
            coinPairings[i].btc[j] = coinPairings[i].btc[j] * PrimaryCoinPriceDaemon.getBitcoinPrice();
        }
        for(var j in coinPairings[i].eth){
            coinPairings[i].eth[j] = coinPairings[i].eth[j] * PrimaryCoinPriceDaemon.getEthereumPrice();
        }
    }
    return coinPairings

}


//figures out if there is an arbitrage opportunity
/*
return: returns a list of pairs which are profitable if bought in one currency and sold in the opposing (eth/btc)
 */
/*
pairs e.g
{
    bat:{
        btc:{high:~, low:~, sell:~, buy:~},
        eth:{high:~, low:~, sell:~, buy:~}
    },
    stx:{~},
}
 */
function pairComparator(pairs, self) {

    //in here, buy represents bids, sell represents asks

    var pairListing = {}
    for (var j in pairs) {
        pairListing[j] = {}
        pairListing[j].btcBuy = pairs[j].eth.buy / pairs[j].btc.sell;
        pairListing[j].ethBuy = pairs[j].btc.buy / pairs[j].eth.sell;

    }


    var profitableTrades = [];

    for (var k in pairListing) {
        if (pairListing[k].btcBuy > 1.0) {
            if (pairListing[k].btcBuy     > 1.0127) {
                console.log();
                profitableTrades.push({
                    buy: k+'_btc',
                    sell: k+'_eth'
                })
            }
            else {
                console.log("coin " + k + " is " + JSON.stringify(pairListing[k]));

            }
        }
        if (pairListing[k].ethBuy > 1) {
            if (pairListing[k].ethBuy > 1.0127) {
                console.log();

                profitableTrades.push({
                    buy: k+'_eth',
                    sell: k+'_btc'
                })
            }
            else {
                console.log("coin " + k + " is " + JSON.stringify(pairListing[k]));

            }
        }
    }

    return profitableTrades
}

function fillHandSet(coinPairList){
    var pairs = coinPairList
    for (var k in pairs){
        if(handSet[k+"_btc"] == undefined){
            handSet[k+"_btc"] = {};
        }
        if(handSet[k+"_eth"] == undefined){
            handSet[k+"_eth"] = {};
        }
        handSet[k+"_eth"].buy = pairs[k].eth.buy;
        handSet[k+"_eth"].sell = pairs[k].eth.sell;
        handSet[k+"_btc"].buy = pairs[k].btc.buy;
        handSet[k+"_btc"].sell = pairs[k].btc.sell;
    }
}

var handSet = {

}
function requestTrade(amount, data){
    console.log('REQUESTING A TRADE');
    console.log('amount :' + amount);
    console.log('trade data :' + JSON.stringify(data));

    //buy gota be ridiculously low
    blah.parentDaemon.emit('do', {
        to:'market',
        from:'arbitrage',
        do:'buy',
        params:{
            pair:data[0].buy,
            amount:amount*.90,
            rate:(handSet[data[0].buy].buy * 1.3).toString().substring(0,10)
        }
    })
    //sell gotta be high enough to work but not high enough to cancel order
    blah.parentDaemon.emit('do', {
        to:'market',
        from:'arbitrage',
        do:'sell',
        params:{
            pair:data[0].sell,
            amount:amount*.95,
            rate:(handSet[data[0].sell].sell * 0.7).toString().substring(0,10)
        }
    })
}