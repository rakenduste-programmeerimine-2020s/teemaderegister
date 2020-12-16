const express = require('express')
const router = express.Router()

const { jwtEnsure, allowRoles } = require('./utils/jwt')
const validate = require('./utils/validate')
const asyncMiddleware = require('./utils/asyncMiddleware')
const multerMiddleware = require('./utils/multerMiddleware')

const { ADMIN } = require('./constants/roles')

const auth = require('./controllers/auth')
const curriculums = require('./controllers/curriculums')
const search = require('./controllers/search')
const supervisors = require('./controllers/supervisors')
const topics = require('./controllers/topics')
const users = require('./controllers/users')
const admin = require('./controllers/admin')
const csv = require('./controllers/generateCSV')
const bodyParser = require('body-parser')
const Topic = require('./models/topic')

/* router.post('/csv/', (ctx) => {
    //console.log('node:  ' , ctx.body)
    const {status, course, level} = ctx.body
   csv.getTopicData(status, course, level)
}) */

router.post('/csv/supervisors', (req, res) => {
    console.log('Konsool1:  ',req.body.supervisorId[2])
})

router.get('/csv/', (req, res) => {
    //console.log('NODE:  ',req.query)
    const { status, course, level } = req.query
    if(status == 'registered'){
        Topic.find({
            'curriculums':  course , 
            'defended': { $exists: false }
            /* 'types':  [level] */ },
            (err, docs) => {
            if (!err) { 
                //console.log(docs);
                return docs
            } else {
                throw err;  
            }
        }).sort({registered: 'desc'})
          .populate('supervisors.supervisor', '_id profile')
          .exec((err, data) => {
            res.send(JSON.stringify(data))
            //console.log('DATA: ',data)        
        })
        //const jsonData = csv.getTopicData(req.query)
        //console.log('KONSOOOL123:  ' ,(jsonData))
        //res.send(jsonData)
    } else {
        Topic.find({
            'curriculums':  [course], 
            'defended': {$exists: true}
           /*  'types':  [level] */ },
            (err, docs) => {
            if (!err) { 
                //console.log(docs);
                return docs
            } else {
                throw err;  
            }
        }).sort({defended: 'desc'})
          .exec((err, data) => {
            res.send(JSON.stringify(data))
            console.log('DATA: ',data)        
        })
    }
})

router.post('/auth/local/login', validate.localLogin, asyncMiddleware(auth.localLogin)) 
router.post('/auth/local/signup', validate.localSignup, asyncMiddleware(auth.localSignup))
router.post('/auth/logout', jwtEnsure, asyncMiddleware(auth.logout))
router.post('/auth/forgot', validate.passwordResetEmail, asyncMiddleware(auth.forgotPassword))
router.get('/auth/reset/:token', asyncMiddleware(auth.validatePasswordResetToken))
router.post('/auth/reset/:token', validate.passwordResetMatch, asyncMiddleware(auth.updatePassword))

router.get('/curriculums/', asyncMiddleware(curriculums.getCurriculums))
router.get('/curriculums/:slug', asyncMiddleware(curriculums.getCurriculumBySlug))
router.post('/curriculums', jwtEnsure, allowRoles([ADMIN]), validate.addCurriculumValidation, asyncMiddleware(curriculums.postCurriculums))

router.get('/search/counts', asyncMiddleware(search.getCounts))

router.get('/supervisors/', asyncMiddleware(supervisors.getSupervisors))
router.get('/supervisors/curriculumForm/', asyncMiddleware(supervisors.getSupervisorsCurriculumForm))
router.get('/supervisors/:slug', asyncMiddleware(supervisors.getSupervisorBySlug))

router.get('/topics/', asyncMiddleware(topics.getTopics))

router.get('/users/me', jwtEnsure, asyncMiddleware(users.getUser))
router.get('/users/profile', jwtEnsure, asyncMiddleware(users.getProfile))
router.put('/users/profile', jwtEnsure, validate.userAccountUpdate, asyncMiddleware(users.updateUser))
router.put('/users/password', jwtEnsure, validate.userPasswordUpdate, asyncMiddleware(users.updatePassword))
router.post('/users/upload-picture', jwtEnsure, multerMiddleware('profileImage'), asyncMiddleware(users.uploadPicture))
router.put('/users/reset-picture', jwtEnsure, asyncMiddleware(users.resetPicture))

// SAMPLE
router.get('/admin/', jwtEnsure, allowRoles([ADMIN]), asyncMiddleware(admin.getSecret))

module.exports = router
