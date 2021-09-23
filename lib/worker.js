// dependencies
const url = require("url");
const http = require("http");
const https = require("https");

const { parseJSON } = require("../helpers/utilities");
const data = require("../lib/data");
const { sendTwilioSms } = require("../helpers/notifications");

const worker = {};

//timer to execute the process once per minute
worker.loop = () => {
  setInterval(() => {
    worker.getAllChecks();
  }, 8000);
};

worker.getAllChecks = () => {
  data.list("checks", (err, checksData) => {
    if (!err && checksData && checksData.length > 0) {
      checksData.forEach((check) => {
        data.read("checks", check, (err, originalCheckData) => {
          if (!err && originalCheckData) {
            worker.validateCheckData(parseJSON(originalCheckData));
          } else {
            console.log("Error: reading one of the check data");
          }
        });
      });
    } else {
      console.log("Error: could not find any checks to process");
    }
  });
};

//validate individual check data
worker.validateCheckData = (originalCheckData) => {
  let originalData = originalCheckData;
  if (originalCheckData && originalCheckData.id) {
    originalData.state =
      typeof originalCheckData.state === "string" &&
      ["up", "down"].indexOf(originalCheckData.state) > -1
        ? originalCheckData.state
        : "down";

    originalData.lastChecked =
      typeof originalCheckData.lastChecked === "number" &&
      originalCheckData.lastChecked > 0
        ? originalCheckData.lastChecked
        : false;

    worker.performCheck(originalData);
  } else {
    console.log("Error: Check was invalid or not properly formatted!");
  }
};

//perform check
worker.performCheck = (originalCheckData) => {
    
  //prepare the initial check outcome
  let checkOutcome = {
    error: false,
    response: false,
  };

  //mark the check has not been sent yet
  let outcomeSent = false;

  let parsedUrl = url.parse(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
    true
  );

  const hostName = parsedUrl.hostname;
  const path = parsedUrl.path;

//   console.log(path)

  //construct the request
  const requestDetails = {
    protocol: originalCheckData.protocol + ':',
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path: path,
    timeout: originalCheckData.timeoutSeconds * 1000,
  };

  let protocolToUse = originalCheckData.protocol === "http" ? http : https;
  

  let req = protocolToUse.request(requestDetails, (res) => {
    //grab the status of the response
    const status = res.statusCode;

    console.log(status)

    //update the check outcome and pass to the next process
    checkOutcome.response = status;
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("error", (e) => {
    //prepare the initial check outcome
    checkOutcome = {
      error: true,
      value: e,
    };

    //update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.on("timeout", (e) => {
    //prepare the initial check outcome
    checkOutcome = {
      error: true,
      value: "timeout",
    };

    //update the check outcome and pass to the next process
    if (!outcomeSent) {
      worker.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  req.end();
};

//save check outcome to database and send to next process
worker.processCheckOutcome = (originalCheckData, checkOutcome) => {
  //check if check outcome is  up or down
  let state =
    !checkOutcome.error &&
    checkOutcome.response &&
    originalCheckData.successCodes.indexOf(checkOutcome.response) > -1
      ? "up"
      : "down";

  //decide whether we should alert the user or not
  let alertWanted =
    originalCheckData.lastChecked && originalCheckData.state !== state
      ? true
      : false;


  //update the check data
  let newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();

  //update the check to disk
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      //send check data to next process
      if (alertWanted) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("alert is not needed as there is no state changed");
      }
    } else {
      console.log("Error: update the checks state failed");
    }
  });
};

//send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
  let message = `Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

sendTwilioSms(newCheckData.userPhone, message, (err) =>{
    console.log(err)
    if(!err){
        console.log(`User was alerted to a state change via SMS: ${message}`)
    }else{
        console.log('There was a problem sending sms to one of the user')
    }
})
};
worker.init = () => {
  // execute all the  checks
  worker.getAllChecks();

  //call the loop so that checks remains continue
  worker.loop();
};

module.exports = worker;
