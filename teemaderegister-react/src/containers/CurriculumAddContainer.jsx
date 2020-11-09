import React from 'react'
import { connect } from 'react-redux'
import { initCurriculum, triggerAddCurriculum } from '../actions/CurriculumActions'
import CurriculumAdd from '../components/CurriculumAdd'

const CurriculumAddContainer = props => <CurriculumAdd {...props} />

const mapStateToProps = state => ({
  curriculumForm: state.curriculum.form
})

export default connect(mapStateToProps, { triggerAddCurriculum, initCurriculum })(CurriculumAddContainer)
