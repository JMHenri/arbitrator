var https = require('https')


module.exports = {
    login: login
}


function login(cb){
    console.log("logged in!")
    console.log("args : " , arguments)
    console.log(cb)
    cb(null);
}