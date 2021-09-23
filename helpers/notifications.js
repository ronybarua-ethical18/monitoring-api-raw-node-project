// dependencies
const https = require("https");
const { twilio } = require("./environments");
const querystring = require('querystring')

// module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendTwilioSms = (phone, msg, callback) => {
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;
  if (userPhone && userMsg) {
    //configure the request payload
    let payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    //stringify the payload
    let stringifyPayload = querystring.stringify(payload)

    //configure the request details
    let requestDetails = {
        hostname: 'api.twilio.com',
        method: 'POST',
        path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
        auth: `${twilio.accountSid}:${twilio.authToken}`,
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    }

    //instantiate the request object
    const req = https.request(requestDetails, (res) =>{

        // get the status code 
        const status = res.statusCode

        if(status === 200 || status === 201){
            callback(false)
        }else{
            callback(`Status code returned was ${status}`)
        }
    })

    req.on('error', (e) =>{
        callback(e)
    })
    
    req.write(stringifyPayload)
    req.end()
  } else {
    callback("Given parameters were invalid");
  }
};

//export the module
module.exports = notifications;
