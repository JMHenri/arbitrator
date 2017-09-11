
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
        this.bitcoinPrice;
        this.ethereumPrice;
        this.logLevel = 1;
        this.parentDaemon = parentDaemon;

        myVar = setInterval(this.bitcoinUpdate, 10000, self);
        myVar = setInterval(this.ethereumUpdate, 10000, self);

    }

    PrimaryCoinPriceDaemon.prototype.bitcoinUpdate = function() {
        publicClientBTC.getProductOrderBook({'level': 2}, callback);
        function callback(err, res, body) {
            bitcoinAsk = body.asks[0][0];
            bitcoinBid = body.bids[0][0];
        }
    };


    PrimaryCoinPriceDaemon.prototype.ethereumUpdate = function() {
        publicClientETH.getProductOrderBook({'level': 2}, callback);
        function callback(err, res, body){
            ethereumBid = body.bids[0][0];
            ethereumAsk = body.asks[0][0];
        }
    };

    PrimaryCoinPriceDaemon.prototype.getBitcoinAsk = function(){
        if(bitcoinPrice > 3000){
            return bitcoinAsk;
        }
        else{
            return undefined
        }
    };
    PrimaryCoinPriceDaemon.prototype.getBitcoinBid = function(){
        if(bitcoinPrice > 3000){
            return bitcoinBid;
        }
        else{
            return undefined
        }
    };
    PrimaryCoinPriceDaemon.prototype.getEthereumAsk = function(){
        if(ethereumPrice > 200){
            return ethereumAsk;

        }
        else{
            return undefined
        }
    };
    PrimaryCoinPriceDaemon.prototype.getEthereumBid = function(){
        if(ethereumPrice > 200){
            return ethereumBid;

        }
        else{
            return undefined
        }
    };

    return PrimaryCoinPriceDaemon;


}());

module.exports = {PrimaryCoinPriceDaemon:PrimaryCoinPriceDaemon};
