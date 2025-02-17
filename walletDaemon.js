
var request = require('request')
var Liqui = require('node.liqui.io');

//publicClient.getProducts(callback);
//all


let liqui = new Liqui(apiKey, apiSecret);



var currentWallet;

var WalletDaemon = (function () {
    setInterval(logWalletData, 10000);

    function WalletDaemon(parentDaemon) {
        var self = this;

        this.logLevel = 1;
        //this.parentDaemon = parentDaemon;

        //myVar = setInterval(this.walletUpdate, 3000, self);

    }


    WalletDaemon.prototype.walletUpdate = function() {
        liqui.getInfo().then(callback);

        function callback(stuff){
            currentWallet = stuff.funds;

        }
    };

    return WalletDaemon;


}());


function logWalletData(){
    liqui.getInfo().then(callback);

    function callback(stuff){
        console.log(JSON.stringify(stuff))

    }
}

module.exports = {WalletDaemon:WalletDaemon};
