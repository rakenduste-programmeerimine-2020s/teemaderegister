const speakeasy = require('speakeasy')
const qrcode = require('qrcode')

var secret = speakeasy.generateSecret({
    name:"Teemaderegister"
})

qrcode.toDataURL(secret.ascii,function(err,data){
    console.log(data)
    console.log(secret)

})

const data =qrcode.toDataURL(secret.otpauth_url,function(err,string){
    if(err)throw err
    console.log(string)
})
console.log(data)