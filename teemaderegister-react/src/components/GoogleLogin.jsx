import React from 'react'
import GoogleBtn from './GoogleBtn'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import { Redirect, Link } from 'react-router-dom'
import { getToken } from '../utils/jwt'
import Breadcrumbs from './Breadcrumbs'
import { Row, Col, Form, Input, Button, message, Tooltip } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { setDocTitle } from '../utils/Helpers'

const FormItem = Form.Item

const { bool, func, string } = PropTypes

const propTypes = {
  initLogin: func.isRequired,
  triggerLogin: func.isRequired
}

class GoogleLogin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
    this.submit = this.submit.bind(this)
    this.formRef = React.createRef()
  }


  componentDidMount () {
    setDocTitle('Login')
  }

  componentWillUnmount () {
    this.props.initLogin()
  }

  submit (values) {
    this.setState({ loading: true })
    // show user loading
    window.setTimeout(() => {
      console.log(values)
      this.props.triggerLogin(values)
    }, 1500)
  }

  render () {
    const {
      location: { search }
    } = this.props

    const { loading } = this.state

    const params = queryString.parse(search)
    const redirect = params.redirect || '/'

    const crumbs = [{ url: this.props.location.pathname, name: 'Sign In' }]

    if (getToken()) {
      return <Redirect to={redirect} />
    }

    return (
      <div className='login width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} onFinish={this.submit} className='form--narrow'>

              <FormItem className='login__password'>
                <FormItem name='password' rules={[
                  { required: true, message: 'Please input your Password!' }
                ]} noStyle>
                  <Input
                    prefix={<LockOutlined />}
                    type='password'
                    placeholder='Password'
                  />
                </FormItem>

              </FormItem>
              <FormItem>
                <FormItem noStyle>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className='button--fullWidth'
                    loading={loading}
                  >
                  Set Password
                  </Button>
                </FormItem>
                <p>


                </p>
              </FormItem>
            </Form>
          </Col>
          <Col span={8} />
        </Row>
      </div>
    )
  }
}

GoogleLogin.propTypes = propTypes

export default GoogleLogin
