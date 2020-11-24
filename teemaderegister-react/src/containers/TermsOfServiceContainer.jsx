import React from 'react'
import { connect } from 'react-redux'

import TermsOfService from '../components/TermsOfService'

const TermsOfServiceContainer = props => <TermsOfService {...props} />

export default connect(null)(TermsOfServiceContainer)
