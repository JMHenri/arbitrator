/**
 * Created by Jake-o on 9/6/2017.
 */
var https = require('https');
var events = require('events');


var Liqui = require('node.liqui.io');


// home
var apiSecret = '99c53b66ae75db769714e03305b312cb4e2725e5b64c845fb286c82b45fb27cc';
var apiKey = '5TU8KGT9-KHJDX1KB-Y6PPN02D-V4OS1LUW-M2OEAZU6';

let liqui = new Liqui(apiKey, apiSecret);


process.on('unhandledRejection', (reason) => {
    console.log('Reason: ' + JSON.stringify(reason));
});
trade()

function trade(data){
    console.log('asdf')

    let params = {
        pair: 'ae_eth',
        rate: " .00099999999999999999999999 ", // the exchange rate between eth and btc to use
        amount: 10 // the number of ae to sell at this rate
    }
    liqui.sell(params).then(function(result){
        console.log("logging result");
        console.log(result)
    })


}
