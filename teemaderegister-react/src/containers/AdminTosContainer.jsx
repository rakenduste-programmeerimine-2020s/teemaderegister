import React from 'react'
import { connect } from 'react-redux'
import { getTos, saveTos } from '../actions/TermsOfServiceActions'

import AdminTos from '../components/AdminTos'

const AdminTosContainer = props => <AdminTos {...props} />

const mapStateToProps = state => ({
  content: state.tos.content
})

export default connect(mapStateToProps, { getTos, saveTos })(AdminTosContainer)
