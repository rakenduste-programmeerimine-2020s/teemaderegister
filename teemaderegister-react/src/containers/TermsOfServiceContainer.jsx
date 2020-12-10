import React from 'react'
import { connect } from 'react-redux'
import { getTos } from '../actions/TermsOfServiceActions'

import TermsOfService from '../components/TermsOfService'

const TermsOfServiceContainer = props => <TermsOfService {...props} />

const mapStateToProps = state => ({
  content: state.tos.content,
  contentLastUpdated: state.tos.contentLastUpdated
})

export default connect(mapStateToProps, { getTos })(TermsOfServiceContainer)
