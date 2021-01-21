import React from 'react'
import { connect } from 'react-redux'
import {initTopic, triggerAddTopic} from '../actions/TopicAddActions'
//Todo add TopicActions
import TopicAdd from '../components/TopicAdd'

const TopicAddContainer = props => <TopicAdd {...props} />

const mapStateToProps = state => ({
  curriculumForm: state.curriculum.form
})

export default connect(mapStateToProps, { triggerAddTopic, initTopic })(TopicAddContainer)
