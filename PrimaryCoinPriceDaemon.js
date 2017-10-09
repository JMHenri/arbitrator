
var request = require('request')

var Gdax = require('gdax');
var publicClientETH = new Gdax.PublicClient("ETH-USD");
var publicClientBTC = new Gdax.PublicClient("BTC-USD");

var bitcoinPriceLocation = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';






//publicClient.getProducts(callback);



var bitcoinBid;
var ethereumBid;
var ethereumAsk;
var bitcoinAsk;

var PrimaryCoinPriceDaemon = (function () {
    function PrimaryCoinPriceDaemon(parentDaemon) {
        var self = this

        this.logLevel = 1;
        this.parentDaemon = parentDaemon;

        myVar = setInterval(this.bitcoinUpdate, 10000, self);
        myVar = setInterval(this.ethereumUpdate, 10000, self);

    }

        PrimaryCoinPriceDaemon.prototype.bitcoinUpdate = function() {
        publicClientBTC.getProductOrderBook({'level': 2}, callback);
        function callback(err, res, body) {

            if(err){
                console.log('GDAX PRICE FAIL')
                bitcoinAsk = undefined;
                bitcoinBid = undefined;
            }
            else{
                console.log();
                console.log('new btc price ' + body.asks[0][0])
                bitcoinAsk = body.asks[0][0];
                bitcoinBid = body.bids[0][0];
            }

        }
    };


    PrimaryCoinPriceDaemon.prototype.ethereumUpdate = function() {
        publicClientETH.getProductOrderBook({'level': 2}, callback);
        function callback(err, res, body){
            if(err){
                console.log('GDAX PRICE FAIL')
                ethereumBid = undefined
                ethereumAsk = undefined
            }
            else
            {
                console.log();
                console.log('new eth price ' + body.asks[0][0])
                ethereumBid = body.bids[0][0];
                ethereumAsk = body.asks[0][0];
            }

        }
    };

    PrimaryCoinPriceDaemon.prototype.getBitcoinPrice = function(){
        if(bitcoinAsk > 3000){
            return bitcoinAsk;
        }
        else{
            return undefined
        }
    };
    PrimaryCoinPriceDaemon.prototype.getBitcoinBid = function(){
        if(bitcoinBid > 3000){
            return bitcoinBid;
        }
        else{
            return undefined
        }
    };
    PrimaryCoinPriceDaemon.prototype.getEthereumPrice = function(){
        if(ethereumAsk > 200){

            return ethereumAsk;

        }
        else{
            return undefined
        }
    };
    PrimaryCoinPriceDaemon.prototype.getEthereumBid = function(){
        if(ethereumBid > 200){
            return ethereumBid;

        }
        else{
            return undefined
        }
    };

    return PrimaryCoinPriceDaemon;


}());

module.exports = {PrimaryCoinPriceDaemon:PrimaryCoinPriceDaemon};
