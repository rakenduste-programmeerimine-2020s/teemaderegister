import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import Api from '../utils/Api'
import {AUTH_GOOGLE_LOGIN_URL, AUTH_LOCAL_LOGIN_URL} from "../constants/ApiConstants";
import {getToken, setToken} from "../utils/jwt";
import * as types from "../constants/ActionTypes";
import {Redirect} from "react-router-dom";
import {triggerLogin} from "../actions/GoogleLoginActions";
import Login from "./Login";

const CLIENT_ID =
  '1045733581630-lgq5jvg56ik811ginfci45adhv93dac7.apps.googleusercontent.com'

/*
const propTypes = {
  triggerLogin: func.isRequired
}*/

class GoogleBtn extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLogined: false,
      accessToken: '',
      givenName: ''
    }

    this.login = this.login.bind(this)
    this.handleLoginFailure = this.handleLoginFailure.bind(this)
    this.logout = this.logout.bind(this)
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this)
  }

  login (response) {
    if (response.accessToken) {
      console.log(response)
      console.log(response.profileObj.email)
      console.log(response.profileObj.name)
      console.log(response.profileObj.givenName)
      console.log(response.profileObj.familyName)
      console.log(response.profileObj.token)

      const creds = {
        email : response.profileObj.email,
        firstName : response.profileObj.givenName,
        lastName : response.profileObj.familyName,
        roles: ["student"]
      }

      console.log(creds);
      this.setState((state) => ({
        isLogined: true,
        accessToken: response.accessToken,
        givenName: response.profileObj.name
      }))
      Api('POST', AUTH_GOOGLE_LOGIN_URL, { data: creds })
          .then(data => {
            console.log(data)
            console.log("AAAAAAAAA")
            setToken(data.token)
            console.log("töken"+getToken())


          }).catch(err => {
        const error = err.data

      })
      const redirect = '/'

      window.location.href = redirect;

    }
  }

  logout (response) {
    this.setState((state) => ({
      isLogined: false,
      accessToken: ''
    }))
  }

  handleLoginFailure (response) {
    alert('Failed to log in')
    console.log(response)
  }

  handleLogoutFailure (response) {
    alert('Failed to log out')
  }

  render () {
/*
    const redirect =  '/'

    if (getToken()) {
      return <Redirect to={redirect} />
    }else{
      console.log("YEET")
    }
*/
    return (
      <div>
        {this.state.isLogined ? (

            <GoogleLogout
                clientId={CLIENT_ID}
                buttonText='Logout'
                onLogoutSuccess={this.logout}
                onFailure={this.handleLogoutFailure}
            ></GoogleLogout>

        ) : (
          <GoogleLogin
            clientId={CLIENT_ID}
            buttonText='Login'
            onSuccess={this.login}
            onFailure={this.handleLoginFailure}
            cookiePolicy={'single_host_origin'}
            responseType='code,token'
          />
        )}

      </div>
    )
  }
}

//GoogleBtn.propTypes = propTypes

export default GoogleBtn
