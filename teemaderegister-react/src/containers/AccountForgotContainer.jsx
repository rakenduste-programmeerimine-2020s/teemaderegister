import React from 'react'
import { connect } from 'react-redux'
import { initPasswordReset, sendPasswordResetLink } from './../actions/PasswordActions'
import AccountForgot from './../components/AccountForgot'

const AccountForgotContainer = props => <AccountForgot {...props} />

const mapStateToProps = state => ({
  password: state.password
})

export default connect(mapStateToProps, { initPasswordReset, sendPasswordResetLink })(AccountForgotContainer)
