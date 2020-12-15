import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { resetPasswordToken, resetPassword } from './../actions/PasswordActions'
import AccountPassword from './../components/AccountPassword'

const AccountPasswordContainer = props => <AccountPassword {...props} />

const mapStateToProps = state => ({
  password: state.password
})

const mapDispatchToProps = (dispatch, props) => {
  const { token } = props.match.params
  return bindActionCreators(
    {
      resetPasswordToken: () => resetPasswordToken(token),
      resetPassword: (values) => resetPassword({...values, token})
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountPasswordContainer)
