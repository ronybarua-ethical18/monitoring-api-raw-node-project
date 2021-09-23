/* 
title : Environments
Description: Handle Environment variables
Author : Rony Jackson
Date  20/09/21
*/

// dependencies

// app object - module scaffolding
const environments = {};

environments.staging = {
  port: 4000,
  envName: "staging",
  secretKey: 'fhshfjsdhfskhd',
  maxCheck: 5,
  twilio: {
    fromPhone: '+12012920891',
    accountSid: 'ACc703a7a431973f3b8050439021bc68f1',
    authToken: 'e6ef06be0eaf2b9ad427318ffdfe5110'
  }
};

environments.production = {
  port: 5000,
  envName: "production",
  secretKey: 'jfhjfkgjhfjkjgklj',
  maxCheck: 5,
  twilio: {
    fromPhone: '+12012920891',
    accountSid: 'ACc703a7a431973f3b8050439021bc68f1',
    authToken: 'e6ef06be0eaf2b9ad427318ffdfe5110'
  }
};

// Determined which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

//export corresponding  environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// export module     
module.exports = environmentToExport;
