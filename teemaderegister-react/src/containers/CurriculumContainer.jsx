import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Curriculum from '../components/Curriculum'
import { getCurriculum, initCurriculum } from '../actions/CurriculumActions'
import {
  clearTableContent,
  getTableContent,
  initTableContent
} from '../actions/TableContentActions'

const CurriculumContainer = props => <Curriculum {...props} />

const mapStateToProps = state => ({
  curriculum: state.curriculum,
  supervisors: state.tableContent.supervisors,
  tableContent: state.tableContent,
  topics: state.tableContent.topics
})

const mapDispatchToProps = (dispatch, props) =>
  bindActionCreators(
    {
      clearTableContent,
      getCurriculum: () => getCurriculum(props.match.params.slug),
      getTableContent,
      initCurriculum,
      initTableContent
    },
    dispatch
  )
export default connect(mapStateToProps, mapDispatchToProps)(CurriculumContainer)
