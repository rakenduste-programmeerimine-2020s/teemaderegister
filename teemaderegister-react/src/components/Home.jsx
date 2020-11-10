import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { setDocTitle } from '../utils/Helpers'
import HomeCollection from './HomeCollection'

import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { array, bool, func, shape } = PropTypes

const propTypes = {
  auth: shape({
    isAuthenticated: bool.isRequired
  }).isRequired,
  getCurriculums: func.isRequired,
  home: shape({
    curriculums: array.isRequired,
    loading: bool.isRequired
  }).isRequired
}

class Home extends React.Component {
  componentDidMount () {
    this.props.getCurriculums()
    setDocTitle('Home')
  }

  render () {
    const {
      home: { loading, curriculums },
      auth: {
        user: { login: { roles } },
        isAuthenticated
      }
    } = this.props
    const showAddCurriculumLink = isAuthenticated && roles.includes('admin')

    return (
      <div className='home width--public-page'>
        <div className='home__intro'>
          <h1>Tere tulemast DTI uue teemaderegistri lehele!</h1>
        </div>
        {showAddCurriculumLink &&
          <Link to='/curriculum/add'>
            <Button icon={<PlusOutlined/>}>Lisa õppekava</Button>
          </Link>}
        {!loading && <HomeCollection curriculums={curriculums} />}
      </div>
    )
  }
}

Home.propTypes = propTypes

export default Home
