import React, { useEffect } from 'react'
import { setDocTitle } from '../utils/Helpers'
import PropTypes from 'prop-types'

const TermsOfService = props => {
  setDocTitle('Terms of Service')

  useEffect(() => {
    props.getTos()
  }, [])

  return (
    <p>{props.content || 'Sisu puudub'}</p>
  )
}

TermsOfService.propTypes = {
  content: PropTypes.string,
  getTos: PropTypes.func.isRequired
}

export default TermsOfService
