/**
 * Created by Jake-o on 8/24/2017.
 */
var request = require('request')


var bitcoinPriceLocation = 'https://api.coinmarketcap.com/v1/ticker/bitcoin/';
var ethereumPriceLocation = 'https://api.coinmarketcap.com/v1/ticker/ethereum/';




var PrimaryCoinPriceDaemon = (function () {
    function PrimaryCoinPriceDaemon(parentDaemon) {
        var self = this
        this.bitcoinPrice;
        this.ethereumPrice;
        this.logLevel = 1;
        this.parentDaemon = parentDaemon;

        myVar = setInterval(this.bitcoinUpdate, 10000, self)
        myVar = setInterval(this.ethereumUpdate, 10000, self)

    }



    PrimaryCoinPriceDaemon.prototype.bitcoinUpdate = function(self){
        var options = {
            url: bitcoinPriceLocation,
            headers: {
                'User-Agent': 'request'
            }
        };

        request(options, cb);
        function cb(error, response, body) {
            if (error) {
                console.log("error " , error);
                self.parentDaemon.emit('error',error)
            }
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                self.bitcoinPrice = body[0]['price_usd'];
            }
        }
    };
    PrimaryCoinPriceDaemon.prototype.ethereumUpdate = function(self){
        var options = {
            url: ethereumPriceLocation,
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
                body = JSON.parse(body);
                self.ethereumPrice = body[0]['price_usd'];
            }
        }
    };

    PrimaryCoinPriceDaemon.prototype.getBitcoinPrice = function(){
        if(this.bitcoinPrice > 3000){
            return this.bitcoinPrice;
        }
    };
    PrimaryCoinPriceDaemon.prototype.getEthereumPrice = function(){
        if(this.ethereumPrice > 200){

        }
    };

    return PrimaryCoinPriceDaemon;

}());

module.exports = PrimaryCoinPriceDaemon;
