import React from 'react'
import { connect } from 'react-redux'
import { initSignUp, triggerSignUp } from '../actions/SignUpActions'
import SignUp from '../components/SignUp'

const SignUpContainer = props => <SignUp {...props} />

const mapStateToProps = state => ({
  signup: state.signup
})

export default connect(mapStateToProps, { initSignUp, triggerSignUp })(SignUpContainer)
