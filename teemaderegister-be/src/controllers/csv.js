const Topic = require('../models/topic')

module.exports.findCsvData = async (req, res) => {
    const { status, course, level } = req.query
    if(status == 'registered'){
        await Topic.find({
            'curriculums':  course , 
            'defended': { $exists: false },
            'registered': {$exists: true}},
            (err, docs) => {
            if (!err) { 
                return docs
            } else {
                throw err;  
            }
        })
        .sort({registered: 'desc'})
        .populate('supervisors.supervisor',  '_id profile.firstName profile.lastName')
        .populate('curriculums')
        .select('title author registered curriculums')
        .exec((err ,data) => {
            res.send(JSON.stringify(data))
        })
    } else {
        await Topic.find({
            'curriculums':  [course], 
            'defended': {$exists: true}},
            (err, docs) => {
            if (!err) { 
                return docs
            } else {
                throw err;  
            }
        })
        .sort({defended: 'desc'})
        .populate('supervisors.supervisor',  '_id profile.firstName profile.lastName')
        .populate('curriculums')
        .select('title author defended curriculums')
        .exec((err, data) => {
            res.send(JSON.stringify(data))     
        })

    }
}