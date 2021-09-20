const handler = {}

handler.notFoundHandler = (requestProperties, callback) =>{
    console.log(requestProperties)
    callback(404, {
        message: 'Requested Url was not found'
    })
}

module.exports = handler