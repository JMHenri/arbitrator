/**
 * Created by Jake-o on 9/6/2017.
 */
var https = require('https');
var events = require('events');


var Liqui = require('node.liqui.io');



var apiSecret = '83dd85b534b2371b8db5445510a8dd7115d11eb6e73a7db117812740833457c7';
var apiKey="4VNMI4N1-ZNNGVF7J-FYTZZ9RP-4TRCTLQ8-FP4L75I6";

let liqui = new Liqui(apiKey, apiSecret);


    process.on('unhandledRejection', (reason) => {
        console.log("UNHANDLED REJECTION");
    console.log('Reason: ' + JSON.stringify(reason));
});
trade()

function trade(data){
    // marketData = {"to":"market","from":"arbitrage","do":"buy","params":{"pair":"dnt_eth","amount":1366.4006418220654,"rate":"0.00014747"}}
    // var buySell = marketData.params.pair.split('_');
    //
    // var check;
    // if(marketData.do == "buy"){
    //     check = buySell[1];
    // }
    // if(marketData.do == "sell"){
    //     check = buySell[0];
    // }
    //
    // var goOrNo = goNogo(check, marketData);
    //
    // console.log("check is " + check);


    liqui.getInfo().then(callback);

    function callback(stuff){
        console.log(stuff)

    }


    //
    //
    // console.log('asdf')
    //
    // let params = {
    //     pair: 'ae_eth',
    //     rate: " .00099999999999999999999999 ", // the exchange rate between eth and btc to use
    //     amount: 10 // the number of ae to sell at this rate
    // }
    // liqui.sell(params).then(function(result){
    //     console.log("logging result");
    //     console.log(result)
    // })


}


function goNogo(check, marketData){

    if(check == 'eth'){

    }
    if(check == 'btc'){

    }
    if(check == 'usdt'){

    }

}