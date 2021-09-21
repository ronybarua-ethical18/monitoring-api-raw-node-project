// dependencies 
const fs = require('fs')
const path = require('path')

const lib = {}

lib.basedir = path.join(__dirname, '/../.data/')

lib.create = function(dir, file, data, callback){
    fs.open(lib.basedir+dir+'/'+file+'.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string
            const stringData = JSON.stringify(data)

            fs.writeFile(fileDescriptor, stringData, function(err){
                if(!err){
                    fs.close(fileDescriptor, function(err) {
                        if(!err){
                            callback(false)
                        }else{
                            callback('Error closing the new file')
                        }
                    })
                }else{
                    callback('Error wrting to the new file')
                }
            })
        }else{
            callback('There was an error, file may already exist')
        }
    })
}

lib.read = (dir, file, callback) =>{
    fs.readFile(lib.basedir+dir+'/'+file+'.json', 'utf8', (err, data) =>{
        callback(err, data)
    })
}

lib.update = (dir, file, data, callback) =>{
    fs.open(lib.basedir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            const stringData=JSON.stringify(data)

            fs.ftruncate(fileDescriptor, (err) =>{
                if(!err){
                    fs.writeFile(fileDescriptor, stringData, (err) =>{
                        if(!err){
                            fs.close(fileDescriptor, (err) =>{
                                if(!err){
                                    callback(false)
                                }else{
                                    callback('Error closing file')
                                }
                            })
                        }else{
                            callback('Error writing file')
                        }
                    })
                }else{
                    console.log('Error truncating the file')
                }
            })
        }else{
            callback('Error updating. File may not exist')
        }
    })
}

lib.delete = (dir, file, callback) =>{
    fs.unlink(lib.basedir+dir+'/'+file+'.json', (err) =>{
        if(!err){
            callback(false)
        }else{
            callback('Error deleting the file')
        }
    })
}
module.exports = lib