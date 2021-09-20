/* 
title : Handle Request and Response
Description: Handle Request and Response
Author : Rony Jackson
Date  20/09/21
*/

// Dependencies 
const url = require('url')
const {StringDecoder} = require('string_decoder')
const routes = require('../routes')
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler')

//module scalffolding
const handler = {}

handler.handleRequestResponse = (req, res) =>{

    // request handling 
    // get the url  and  parse it 
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '') //ignore unwanted slashes

    const method = req.method.toLowerCase()
    const queryStringObject = parsedUrl.query

    const headers = req.headers
    console.log(headers)

    const decoder = new StringDecoder('utf-8')
    let realData = ''

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headers
    }

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler

    chosenHandler(requestProperties, (statusCode, payload) =>{
        statusCode = typeof(statusCode) === 'number' ? statusCode : 500 
        payload = typeof(payload) === 'object' ? payload : {} 

        const payloadString = JSON.stringify(payload)

        // return the final string 
        res.writeHead(statusCode)
        res.end(payloadString)
    })
    req.on('data', (buffer) =>{
        realData += decoder.write(buffer)
    })

    req.on('end', () =>{
        realData += decoder.end()
        console.log(realData)
        res.end('Hello World')
    })
}

module.exports = handler