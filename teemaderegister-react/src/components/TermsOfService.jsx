import React from 'react'
import { setDocTitle } from '../utils/Helpers'
import PropTypes from 'prop-types'

const TermsOfService = ({ content }) => {
  setDocTitle('Terms of Service')

  return (
    <p>{content || 'Sisu puudub'}</p>
  )
}

TermsOfService.propTypes = {
  content: PropTypes.string
}

export default TermsOfService
