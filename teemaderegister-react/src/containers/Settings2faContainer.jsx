import React from 'react'
import { connect } from 'react-redux'
import { initSettings, changePassword } from '../actions/SettingsActions'
import Settings2fa from '../components/Settings2fa'

const Settings2faContainer = props => <Settings2fa {...props} />

const mapStateToProps = state => ({
  settings: state.settings
})

export default connect(mapStateToProps, { initSettings, changePassword })(SettingsPasswordContainer)
