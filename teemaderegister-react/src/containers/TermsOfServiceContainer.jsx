import React from 'react'
import { connect } from 'react-redux'
import { getTos, saveTos } from '../actions/TermsOfServiceActions'

import TermsOfService from '../components/TermsOfService'

const TermsOfServiceContainer = props => <TermsOfService {...props} />

const mapStateToProps = state => ({
  content: state.content
})

export default connect(mapStateToProps, { getTos, saveTos })(TermsOfServiceContainer)
