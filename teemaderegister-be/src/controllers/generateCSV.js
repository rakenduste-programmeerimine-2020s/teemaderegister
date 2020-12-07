const Topic = require('../models/topic')
const { TopicsQuery } = require('../utils/queryHelpers')

module.exports.getTopicData = ({status, course, level}, res) => {
    //console.log('kohal', course, status, level)
    console.log('töötab: ', status) 

    
    /* switch(status){
        case 'registered':
            const {topics} = Topic.find({
                'curriculums': course, 
                'defended': {$exists: false}, 
                'types': ['SE', level]}, (err, docs) => {
                if (!err) { 
                    //console.log('docs: ', docs)
                    //return 'taun'
                    response = 'taun'
                    return response
                } else {
                    throw err;
                }
        })
        return response
        case 'defended':
            Topic.countDocuments({
                'curriculums': [course], 
                'defended': {$exists: true}},
                (err, docs) => {
                if (!err) { 
                    console.log(docs);
                    return docs
                } else {
                    throw err;  
                }
        })
        return response
    } */

    if(status == 'registered'){
        const response = Topic.countDocuments({
            'curriculums': [course], 
            'defended': {$exists: true}},
            (err, docs) => {
            if (!err) { 
                //console.log(docs);
                return docs
            } else {
                throw err;  
            }
        }).exec((err, data) => {
            res.send(data)
        })
        //return response
    }

} 