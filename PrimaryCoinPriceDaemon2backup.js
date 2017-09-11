/**
 * Created by Jake-o on 8/24/2017.
 */
var request = require('request')


var bitcoinPriceLocation = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';
var ethereumPriceLocation = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';


var Liqui = require('node.liqui.io');

var apiSecret='c41e985a1af178823f9213e7cdf9febba54fa96d41f3cca53e4091a1d394767a'
var apiKey='1A79T0T6-9VVNF43F-IOZGKJCZ-6F9SVTBI-JZL8CTQ5'

let liqui = new Liqui(apiKey, apiSecret);
var bitcoinPrice;
var ethereumPrice;


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
        liqui.ticker('btc_usdt').then(result => {
            bitcoinPrice = result.btc_usdt.sell
        });
    };


    PrimaryCoinPriceDaemon.prototype.ethereumUpdate = function() {
        liqui.ticker('eth_usdt').then(result => {
            ethereumPrice = result.eth_usdt.sell
        });
    };

    PrimaryCoinPriceDaemon.prototype.getBitcoinPrice = function(){
        if(bitcoinPrice > 3000){
            return bitcoinPrice;
        }
        else{
            return undefined
        }
    };
    PrimaryCoinPriceDaemon.prototype.getEthereumPrice = function(){
        if(ethereumPrice > 200){
            return ethereumPrice;

        }
        else{
            return undefined
        }
    };

    return PrimaryCoinPriceDaemon;


}());

module.exports = {PrimaryCoinPriceDaemon:PrimaryCoinPriceDaemon};
