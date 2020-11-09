require('dotenv').config()

const app = require('./app')
const databaseConnection = require('./db')
const log = require('./utils/logger')

;(async () => {
  try {
    await databaseConnection

    const serverConnection = app.listen(process.env.PORT || 3000, () =>
      log.info(
        `App ${process.env.APP_NAME}` +
        ` started in ${process.env.NODE_ENV}` +
        ` on port ${serverConnection.address().port}`
      )
    )

    process.on('SIGINT', () => {
      databaseConnection.close()
      serverConnection.close()
      log.info('Server was shut down gracefully')
    })
  } catch (error) {
    log.error(`Server encountered ${error}`)
  }
})()
