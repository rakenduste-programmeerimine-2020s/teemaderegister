const User = require('../models/user')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')


const secret = speakeasy.generateSecret({
    name: process.env.QR_SECRET
})

module.exports.create = async (req, res) => {
    const {_id} = req.user
    const user = await User.findOne({_id})
    try {
        if (user.factor) return res.json('Cannot add anymore!');
    } catch (e) {
        console.log(e);
    }

    console.log(qrcode.toDataURL(secret.otpauth_url, async (err, data) => {
        user.factor=data
        await new User(user).save()
        res.json(user)
    }))

}

module.exports.get = async (req, res) => {
    const {_id} = req.user
    const {factor} = await User.findOne({_id})
    return res.json(factor)
}