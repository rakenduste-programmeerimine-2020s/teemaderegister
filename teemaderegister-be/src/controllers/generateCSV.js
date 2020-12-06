const Topic = require('../models/topic')
const { TopicsQuery } = require('../utils/queryHelpers')

module.exports.getTopicData = (status, course, level) => {
    // console.log('kohal', course)
    if (status == 'registered') {
       const response =  Topic.find({'curriculums': [course], 'defended': {$exists: false}, 'types': level}, function(err, docs) {
            if (!err) { 
                console.log(docs);
            }
            else {
                throw err;
            }
        });    
    } else {
       const response = Topic.countDocuments({'curriculums': [course], 'defended': {$exists: true}}, function(err, docs) {
            if (!err) { 
                console.log(docs);
            }
            else {
                throw err;  
            }
        })    
    }
    return response
} 