import React, { useEffect } from 'react'
import { setDocTitle } from '../utils/Helpers'
import PropTypes from 'prop-types'
import { Layout, Typography, Space } from 'antd'

const { Title, Paragraph } = Typography

const { Content } = Layout

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
    <Layout className='layout termsOfService width--public-page'>
      <Space direction='vertical' align='center'>
        <Title>{'Teemaderegister Terms of Service'}</Title>
      </Space>
      <Content>
        <Space direction='vertical' align='start'>
          <Title level={5}>{'Last updated at ' + formattedTime}</Title>
          <Paragraph>{props.content || 'Sisu puudub'}</Paragraph>
        </Space>
      </Content>

    </Layout>
  )
}

TermsOfService.propTypes = {
  content: PropTypes.string,
  contentLastUpdated: PropTypes.string,
  getTos: PropTypes.func.isRequired
}

export default TermsOfService
