const speakeasy = require('speakeasy')
var verified =speakeasy.totp.verify({
    secret: 'FFYD4RR6GROUG6THGE2E2P2QKZYT4MBTPJFW2ILIERBGQS3BIJFQ',
    encoding:'base32',
    token:'141890'
})

console.log(verified)