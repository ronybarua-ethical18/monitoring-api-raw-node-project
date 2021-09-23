/* 
title : Uptime API Monitoring
Description: A RESTful Api to monitor up and down time of an user defined links
Author : Rony Jackson
Date  20/09/21
*/

// dependencies 
const server = require("./lib/server");
const worker = require("./lib/worker");


// app object - module scaffolding 
const app = {}

app.init = () =>{
    //start the server
    server.init()

    //start the worker
    worker.init()
}

app.init()

module.exports = app