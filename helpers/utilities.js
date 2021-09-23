/* 
title : Utilities
Description: Handle Utilities functions
Author : Rony Jackson
Date  20/09/21
*/

// dependencies
const crypto = require("crypto");
const environments = require("./environments");

// app object - module scaffolding
const utilities = {};

// parse string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};

// create random string
utilities.createRandomString = (strLength) => {
  let length = strLength;
  length = typeof strLength === "number" && strLength > 0 ? strLength : false;

  if (length) {
    let possibleCharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";

    for (let i = 0; i < length; i++) {
      const randomString = possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length)
      );
      output += randomString
    }
    return output
  }
  return "fskjhfsh";
};

// hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

// export module
module.exports = utilities;
