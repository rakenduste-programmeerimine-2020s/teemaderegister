const multer = require('multer')
const path = require('path')
const { profilePictureUpload } = require('./validate')

module.exports = field => {
  const { filename, destination, fileFilter, limits } = uploadSettings(field)

  return multer({
    storage: multer.diskStorage({ filename, destination }),
    limits,
    fileFilter
  }).single(field)
}

const uploadSettings = field => {
  const defaultSettings = {
    filename: (req, file, next) =>
      next(null, file.originalname + '-' + new Date().getTime() + path.extname(file.originalname)),
    destination: process.env.UPLOAD_DIR + '/misc',
    fileFilter: (req, file, next) => next(new Error('File not validated file type')),
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * process.env.UPLOAD_FILE_SIZE_LIMIT_IN_MB
    }
  }

  switch (field) {
    case 'profileImage':
      return {
        ...defaultSettings,
        filename: (req, file, next) => next(null, req.user._id + '.jpg'),
        destination: process.env.UPLOAD_DIR + '/profile/original',
        fileFilter: (req, file, next) => profilePictureUpload(req, file, next),
        limits: {
          ...defaultSettings.limits,
          fileSize: 1024 * 1024 * parseInt(process.env.PROFILE_PIC_MAX_SIZE_IN_MB)
        }
      }
    default:
      return defaultSettings
  }
}
