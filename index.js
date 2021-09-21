/* 
title : Uptime API Monitoring
Description: A RESTful Api to monitor up and down time of an user defined links
Author : Rony Jackson
Date  20/09/21
*/

// dependencies 
const http = require('http')
const { handleRequestResponse } = require('./helpers/handleReqRes')
const environment =  require('./helpers/environments')
const data = require('./lib/data')


// app object - module scaffolding 
const app = {}

//testing file system
data.create('test', 'newFile2', {'name' : 'Bangladesh', 'language' : 'Bangla'}, (err) =>{
    console.log(`error was`, err)
})

//read the file
data.read('test', 'newFile', (err, data) =>{
    console.log(err, data)
})

//update the file
data.update('test', 'newFile', {'name' : 'Switzerland', 'language' : 'Spanish'}, (err) =>{
    console.log(err)
})

//delete  file
data.delete('test', 'newFile2', (err) =>{
    console.log(err)
})

// config 
// app.config = {
//     port: 4000
// }



// create server 
app.createServer = () =>{
   const server = http.createServer(app.handleRequestResponse)
   server.listen(environment.port, () =>{
       console.log(`listening to port ${environment.port}`)
   })
}

// handle Request Response 
app.handleRequestResponse = handleRequestResponse

app.createServer()