var ImageKit = require("imagekit");
const mongoose = require("mongoose")
var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLICKKEY,
    privateKey : process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint : process.env.IMAGEKIT_URLENDPOINT
});

function uploadFile(file){
    return new Promise((resolve,reject) => {
        imagekit.upload({
            file:file.buffer,
            fileName:new mongoose.Types.ObjectId().toString(),
            folder:"moddy_player"
        },(error,result) => {
            if(error){
                reject(error)
            }else{
                resolve(result)
            }
        })
    })
}

module.exports = uploadFile

