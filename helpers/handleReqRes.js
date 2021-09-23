/* 
title : Handle Request and Response
Description: Handle Request and Response
Author : Rony Jackson
Date  20/09/21
*/

// Dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");
const { parseJSON } = require("../helpers/utilities");

//module scalffolding
const handler = {};

handler.handleRequestResponse = (req, res) => {
  // request handling
  // get the url  and  parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, ""); //ignore unwanted slashes

  const method = req.method.toLowerCase();
  const queryStringObject = parsedUrl.query;

  const headersObject = req.headers;
  // console.log(headers);

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const requestProperties = {
    parsedUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headersObject,
  };

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    requestProperties.body = parseJSON(realData)
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      // return the final string

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

module.exports = handler;
