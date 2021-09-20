/* 
title : Uptime API Monitoring
Description: A RESTful Api to monitor up and down time of an user defined links
Author : Rony Jackson
Date  20/09/21
*/

// dependencies 
const http = require('http')
const { handleRequestResponse } = require('./helpers/handleReqRes')


// app object - module scaffolding 
const app = {}

// config 
app.config = {
    port: 4000
}

// create server 
app.createServer = () =>{
   const server = http.createServer(app.handleRequestResponse)
   server.listen(app.config.port, () =>{
       console.log('listening to port 4000')
   })
}

// handle Request Response 
app.handleRequestResponse = handleRequestResponse

app.createServer()