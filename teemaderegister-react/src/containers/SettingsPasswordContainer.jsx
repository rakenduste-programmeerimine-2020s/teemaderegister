import React from 'react'
import { connect } from 'react-redux'
import { initSettings, changePassword } from '../actions/SettingsActions'
import SettingsPassword from '../components/SettingsPassword'

const SettingsPasswordContainer = props => <SettingsPassword {...props} />

const mapStateToProps = state => ({
  settings: state.settings
})

export default connect(mapStateToProps, { initSettings, changePassword })(SettingsPasswordContainer)
