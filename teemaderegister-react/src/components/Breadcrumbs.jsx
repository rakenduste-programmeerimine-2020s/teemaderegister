import React from 'react'
import { PropTypes } from 'prop-types'
import { Breadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { arrayOf, shape, string } = PropTypes

const propTypes = {
  crumbs: arrayOf(
    shape({
      name: string.isRequired,
      url: string
    }))
}

const Breadcrumbs = props => {
  const { crumbs } = props

  const extraBreadcrumbItems = crumbs.map(crumb => {
    const { name, url } = crumb

    const link = url
      ? <Link to={url}>
        {name}
      </Link>
      : name

    return (
      <Breadcrumb.Item key={url}>
        {link}
      </Breadcrumb.Item>
    )
  })

  const breadcrumbItems = [
    <Breadcrumb.Item key='home'>
      <Link to='/'>
        <HomeOutlined />
      </Link>
    </Breadcrumb.Item>
  ].concat(extraBreadcrumbItems)

  return (
    <div className='breadcrumbs'>
      <Breadcrumb>
        {breadcrumbItems}
      </Breadcrumb>
    </div>
  )
}

Breadcrumbs.propTypes = propTypes

export default Breadcrumbs
