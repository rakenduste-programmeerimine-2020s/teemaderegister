import React from 'react'
import GoogleLogin from '../components/GoogleLogin'
import {connect} from "react-redux";
import {initLogin, triggerLogin} from "../actions/GoogleLoginActions";

const GoogleLoginContainer = props => <GoogleLogin {...props} />

const mapStateToProps = state => ({
    GoogleLogin: state.GoogleLogin,
    auth: state.auth
})

export default connect(mapStateToProps, { initLogin, triggerLogin })(GoogleLoginContainer)