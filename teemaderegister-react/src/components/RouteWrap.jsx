import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'

const { bool, func, shape, string } = PropTypes

const propTypes = {
  Component: func.isRequired,
  auth: shape({
    authInProgress: bool.isRequired,
    isAuthenticated: bool.isRequired
  }).isRequired,
  checkUser: func.isRequired,
  location: shape({
    pathname: string.isRequired
  }).isRequired,
  options: shape({
    restrict: bool
  })
}

class RouteWrap extends React.Component {
  constructor (props) {
    super(props)
    this.state = { allowPageLoad: false }
  }

  componentDidMount () {
    this.props.checkUser()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.auth.authInProgress === true &&
        nextProps.auth.authInProgress === false) {
      // auth finished, allow to load page
      this.setState({ allowPageLoad: true })
    }
  }

  render () {
    const { allowPageLoad } = this.state
    const {
      auth: { isAuthenticated },
      location: { pathname },
      Component,
      options: { restrict }
    } = this.props

    if (restrict && !isAuthenticated && allowPageLoad) {
      const redirect = {
        pathname: '/login',
        search: '?redirect=' + pathname
      }

      return <Redirect to={redirect} />
    } else if (allowPageLoad) {
      return <Component {...this.props} />
    } else {
      // loading...
      return null
    }
  }
}

RouteWrap.propTypes = propTypes

export default RouteWrap
