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
  initCurriculum: func.isRequired,
  location: shape({
    pathname: string.isRequired
  }).isRequired,
  triggerAddCurriculum: func.isRequired

}

class AddCurriculum extends React.Component {
  constructor (props) {
    super(props)

    this.languages = ['ET', 'EN']
    this.languagesValues = []

    this.fetchUsers = debounce(this.fetchUsers.bind(this), 500)
    this.submit = this.submit.bind(this)
    this.languagesChanged = this.languagesChanged.bind(this)

    this.state = {
      representatives: [],
      fetching: false
    }
    this.formRef = React.createRef()
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    const { curriculumForm } = this.props
    const { curriculum, error, loading, hasError } = nextProps.curriculumForm

    if (curriculumForm.loading && !loading) {
      if (curriculum._id) {
        message.success('Saved new curriculum ' + curriculum.names.et)
        this.formRef.current.resetFields()
      }
      if (hasError) {
        message.error(error.message, 10)
      }
    }
  }

  componentDidMount () {
    setDocTitle('Add Curriculum')
  }

  componentWillUnmount () {
    this.props.initCurriculum()
  }

  languagesChanged (values) {
    this.languagesValues = values
  }

  fetchUsers (value) {
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

  submit (values) {
    this.props.triggerAddCurriculum({
      ...values,
      languages: this.languagesValues,
      representative: values.representative.key,
      names: { et: values.nameEt, en: values.nameEn },
      nameEt: undefined,
      nameEn: undefined
    })
  }

  render () {
    const {
      curriculumForm: { loading }
    } = this.props

    const crumbs = [{ url: null, name: 'Lisa õppekava' }]
    const { representatives, fetching } = this.state

    return (
      <div className='curriculumAdd width--public-page'>
        <Breadcrumbs crumbs={crumbs} />
        <Row gutter={8}>
          <Col span={8} />
          <Col xs={24} sm={8}>
            <Form ref={this.formRef} onFinish={this.submit} className='form--narrow'>
              <h2 className='text-align--center'>Lisa õppekava</h2>
              <FormItem label='Abbreviation' name='abbreviation' rules={[{ required: true, message: 'Please input your abbreviation!' }]}>
                <Input id='abbreviation' />
              </FormItem>
              <FormItem label='Type' name='type' rules={[{ required: true, message: 'Please select type!' }]}>
                <Select>
                  {CURRICULUM_TYPES.map(function (type) {
                    return <Option key={type} value={type}>{type}</Option>
                  })}
                </Select>
              </FormItem>
              <FormItem label='Representative'>
                <Tooltip
                  placement='topLeft'
                  title='Start typing name'
                  trigger='focus'
                >
                  <FormItem noStyle name='representative' rules={[{ required: true, message: 'Please select represantive!' }]}>
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
              <FormItem label='Faculty' name='faculty' initialValue={process.env.FACULTY} rules={[{ required: true, message: 'Please input faculty!' }]}>
                <Input disabled/>
              </FormItem>
              <FormItem label='Languages' name='languages' rules={[{ required: true, message: 'Please select language!' }]}>
                <CheckboxGroup
                  options={this.languages}
                  onChange={this.languagesChanged}
                />
              </FormItem>
              <FormItem label='Name ET' name='nameEt' rules={[
                { required: true, message: 'Please input name!' },
                { min: 3, message: 'Name has to be atleast 3 chars long!' }
              ]}>
                <Input/>
              </FormItem>
              <FormItem label='Name EN' name='nameEn' rules={[
                { required: true, message: 'Please input name!' },
                { min: 3, message: 'Name has to be atleast 3 chars long!' }
              ]}>
                <Input/>
              </FormItem>
              <FormItem>
                <Button
                  type='primary'
                  htmlType='submit'
                  className='button--fullWidth'
                  loading={loading}
                >
                  Add Curriculum
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

AddCurriculum.propTypes = propTypes

export default AddCurriculum
