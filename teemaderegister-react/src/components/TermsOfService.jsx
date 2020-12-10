import React, { useEffect } from 'react'
import { setDocTitle } from '../utils/Helpers'
import PropTypes from 'prop-types'

const formatter = new Intl.DateTimeFormat('et-EE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
})

const TermsOfService = props => {
  const formattedTime = formatter.format(new Date(props.contentLastUpdated))
  setDocTitle('Terms of Service')

  useEffect(() => {
    props.getTos()
  }, [])

  return (
    <React.Fragment>
      <h3>{formattedTime}</h3>
      <p>{props.content || 'Sisu puudub'}</p>
    </React.Fragment>

  )
}

TermsOfService.propTypes = {
  content: PropTypes.string,
  contentLastUpdated: PropTypes.string,
  getTos: PropTypes.func.isRequired
}

export default TermsOfService
