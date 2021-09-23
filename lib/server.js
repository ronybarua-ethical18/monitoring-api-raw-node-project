/* 
title : Uptime API Monitoring
Description: A RESTful Api to monitor up and down time of an user defined links
Author : Rony Jackson
Date  20/09/21
*/

// dependencies 
const http = require('http')
const { handleRequestResponse } = require('../helpers/handleReqRes')
const environment =  require('../helpers/environments')
const { sendTwilioSms } = require('../helpers/notifications')


// server object - module scaffolding 
const server = {}

//call the twilio function
sendTwilioSms('01538293058', 'Hello Talking from Twilio', (err) =>{
    // console.log(`The error was`, err)
})

// create server 
server.createServer = () =>{
   const createServerVariable = http.createServer(server.handleRequestResponse)
   createServerVariable.listen(environment.port, () =>{
       console.log(`listening to port ${environment.port}`)
   })
}

// handle Request Response 
server.handleRequestResponse = handleRequestResponse

server.init = () =>{
    server.createServer()
}

module.exports = server
