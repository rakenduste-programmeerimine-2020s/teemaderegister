const nodemailer = require('nodemailer')
const htmlToText = require('html-to-text')
const pug = require('pug')
const juice = require('juice')
const Promise = require('bluebird')
const path = require('path')
const TEMPLATE_FOLDER_PATH = path.join(__dirname, '../', 'mailTemplates')
const log = require('./logger')

const transporterSettings = {
  host: process.env.MAILSERVICE_HOST,
  port: process.env.MAILSERVICE_PORT,
  auth: {
    user: process.env.MAILSERVICE_USERNAME,
    pass: process.env.MAILSERVICE_PASSWORD
  }
}

const transport = nodemailer.createTransport(transporterSettings)

/**
 *  Template engine PUG is used, please change if required
 * @param template Generates html from given template file name and uses data for template
 */
const createHtmlFromTemplate = (template) => {
  const { name, data } = template
  const html = pug.renderFile(`${TEMPLATE_FOLDER_PATH}/${name}/index.pug`, data)
  return juice(html)
}

/**
 * Function generates html from file and sends it to user
 * @param options Options for html template and for mail options for transporter
 */
module.exports.sendMail = (options) => {
  const { to, subject, template } = options
  const html = createHtmlFromTemplate(template)
  const text = htmlToText.fromString(html)

  const mailOptions = {
    from: options.from || `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER}>`,
    to,
    subject,
    html,
    text
  }

  log.debug(mailOptions)

  const nodemailerSendMail = Promise.promisify(transport.sendMail, { context: transport })
  return nodemailerSendMail(mailOptions)
}
