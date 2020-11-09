import React from 'react'
import { connect } from 'react-redux'
import { initLogin, triggerLogin } from '../actions/LoginActions'
import Login from '../components/Login'

const LoginContainer = props => <Login {...props} />

const mapStateToProps = state => ({
  login: state.login
})

export default connect(mapStateToProps, { initLogin, triggerLogin })(LoginContainer)
