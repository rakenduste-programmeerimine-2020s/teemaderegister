import React from 'react'
import PropTypes from 'prop-types'
import Breadcrumbs from './Breadcrumbs'
import { Row, Col, Form, Input, Button, message, Select, Spin, Checkbox, Tooltip } from 'antd'
import { debounce } from 'lodash'
import { setDocTitle } from '../utils/Helpers'
import { CURRICULUM_TYPES } from '../constants/CurriculumTypes'

import Api from '../utils/Api'
import { SUPERVISOR_CURRICULUMFORM_URL } from '../constants/ApiConstants'

const Option = Select.Option
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

const { bool, func, object, shape, string } = PropTypes

const propTypes = {
  curriculumForm: shape({
    curriculum: object.isRequired,
    error: object.isRequired,
    loading: bool.isRequired,
    hasError: bool.isRequired
  }).isRequired,
  initTopic: func.isRequired,
  location: shape({
    pathname: string.isRequired
  }).isRequired,
  triggerAddTopic: func.isRequired

}

class AddTopic extends React.Component {
  constructor(props) {
    super(props)

    this.seSelection = ['Yes', 'No']

    this.fetchUsers = debounce(this.fetchUsers.bind(this), 500)
    this.submit = this.submit.bind(this)

    this.state = {
      representatives: [],
      fetching: false
    }
    this.formRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { curriculumForm } = this.props
    const { curriculum, error, loading, hasError } = nextProps.curriculumForm

    if (curriculumForm.loading && !loading) {
      if (curriculum._id) {
        message.success('Save a new topic ' + curriculum.names.et)
        this.formRef.current.resetFields()
      }
      if (hasError) {
        message.error(error.message, 10)
      }
    }
  }

  componentDidMount() {
    setDocTitle('Add Topic')
  }

  componentWillUnmount() {
    this.props.initTopic()
  }

  languagesChanged(values) {
    this.languagesValues = values
  }

  fetchUsers(value) {
    if (!value) return

    this.setState({ fetching: true }, () => {
      Api('GET', SUPERVISOR_CURRICULUMFORM_URL, { params: { q: value } })
        .then(body => {
          const representatives = body.supervisors.map(user => ({
            text: user.fullName,
            value: user._id
          }))
          this.setState({ representatives, fetching: false })
        })
    })
  }

  submit(values) {
    this.props.triggerAddTopic({
      ...values,
      supervisors: [values.representative.key]
    })
  }

  render() {
    const {
      curriculumForm: { loading }
    } = this.props

    const crumbs = [{ url: null, name: 'Lisa Teema' }]
    const { representatives, fetching } = this.state

    return (
      <div className='topicAdd width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} onFinish={this.submit} className='form--narrow'>
              <h2 className='text-align--center'>Lisa Teema</h2>
              <FormItem label='Title' name='title' rules={[{ required: true, message: 'Please input a title for the topic!' }]}>
                <Input id='title' />
              </FormItem>
              <FormItem label='Title (English)' name='titleEng' rules={[{ required: true, message: 'Please input a title for the topic!' }]}>
                <Input id='titleEng' />
              </FormItem>
              <FormItem label='Description' name='description' rules={[{ required: true, message: 'Please input a a description for the topic' }]}>
                <Input id='description' />
              </FormItem>
              <FormItem label='Type' name='type' rules={[{ required: true, message: 'Please select type!' }]}>
                <Select>
                  {CURRICULUM_TYPES.map(function (type) {
                    return <Option key={type} value={type}>{type}</Option>
                  })}
                </Select>
              </FormItem>
              <FormItem label='Supervisor'>
                <Tooltip
                  placement='topLeft'
                  title='Type supervisor name.'
                  trigger='focus'
                >

                  <FormItem noStyle name='supervisor' rules={[{ required: true, message: 'Please select a supervisor for the topic!' }]}>
                    <Select
                      showSearch
                      labelInValue
                      notFoundContent={fetching ? <Spin size='small' /> : null}
                      filterOption={false}
                      onSearch={this.fetchUsers}
                      style={{ width: '100%' }}
                    >
                      {representatives.map(d => <Option key={d.value}>{d.text}</Option>)}
                    </Select>
                  </FormItem>
                </Tooltip>
              </FormItem>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='button--fullWidth'
                  loading={loading}
                >
                  Add Topic
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={8} />
        </Row>
      </div>
    )
  }
}

AddTopic.propTypes = propTypes

export default AddTopic
