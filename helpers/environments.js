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
};

environments.production = {
  port: 5000,
  envName: "production",
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
