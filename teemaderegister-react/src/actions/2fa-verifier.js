const speakeasy = require('speakeasy')
var verified =speakeasy.totp.verify({
    secret: '9>T!G,r>..4RtCGLM9Hv12%,<PVWMhsI',
    encoding:'ascii',
    token:'456183'
})

console.log(verified)