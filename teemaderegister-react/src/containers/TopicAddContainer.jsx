import React from 'react'
import { connect } from 'react-redux'
import {initTopic, createTopic} from '../actions/TopicAddActions'
import TopicAdd from '../components/TopicAdd'

const TopicAddContainer = props => <TopicAdd {...props} />

const mapStateToProps = state => ({
  curriculumForm: state.curriculum.form
})

export default connect(mapStateToProps, { createTopic, initTopic })(TopicAddContainer)
