import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {createTopic, getSupervisors, getCurriculums} from '../actions/SupervisorActions'
import {setDocTitle} from '../utils/Helpers'
import {Button, Form, Input, notification, Select} from 'antd'

const { Option } = Select

const SupervisorNewTopic = (props) => {
  const [supervisors, setSupervisors] = useState([])
  const [curriculums, setCurriculums] = useState([])
  const [option, setOption] = useState()

  const [main, setMain] = useState()
  const [co, setCo] = useState()

  useEffect(() => {
    setDocTitle('Create Topic')
    const fetchData = async () => {
      const fetchSupervisors = await props.getSupervisors()
      setSupervisors(fetchSupervisors)
      const fetchCurriculums = await props.getCurriculums()
      setCurriculums(fetchCurriculums)
    }

    fetchData()
  }, [])

  const onFinish = async (values) => {
    console.log(values)
    values.slug = values.title.replace(' ', '-')

    if (main) {
      values.supervisors = []
      values.supervisors.push({
        'type': 'Main',
        'supervisor': main
      })
    }

    if (co) {
      values.supervisors = []
      values.supervisors.push({
        'type': 'Co',
        'supervisor': co
      })
    }

    if (option === 'accepted') {
      values.accepted = new Date()
    } else if (option === 'registered') {
      values.registered = new Date()
    } else if (option === 'defended') {
      values.defended = new Date()
    }

    // eslint-disable-next-line react/prop-types
    const sendTopic = await props.createTopic(values)
    if (sendTopic.success) return notification.success({message: 'Created Topic'})
    notification.error({message: sendTopic.message})
    console.log(sendTopic)
  }

  const onFinishFailed = (errorInfo) => {
    notification.error({message: errorInfo})
  }

  const handleChangeMain = value => {
    setMain(value)
  }

  const handleChangeCo = value => {
    setCo(value)
  }

  const TYPECHANGE = value => {
    setOption(value)
  }

  return (
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      labelCol={{span: 3}}
      wrapperCol={{span: 14}}
    >
      <Form.Item label={'Title'} name={'title'} required={true}>
        <Input/>
      </Form.Item>

      <Form.Item label={'Title in English'} name={'titleEng'} required={true}>
        <Input/>
      </Form.Item>

      <Form.Item label={'Description'} name={'description'} required={true}>
        <Input.TextArea />
      </Form.Item>

      <Form.Item label={'First name'} name={['author', 'firstName']}>
        <Input/>
      </Form.Item>

      <Form.Item label={'Last name'} name={['author', 'lastName']}>
        <Input/>
      </Form.Item>

      <Form.Item label={'Special Conditions'} name={'specialConditions'}>
        <Input/>
      </Form.Item>

      <Form.Item label={'File link'} name={'file'}>
        <Input/>
      </Form.Item>

      <Form.Item label={'Starred'} name={'starred'}>
        <Select>
          <Option value={true}>True</Option>
          <Option value={false}>False</Option>
        </Select>
      </Form.Item>

      <Form.Item label={'Types'} name={'types'} required={true}>
        <Select
          mode='multiple'
          className='maxWidth'
          placeholder='select at least one type'
        >
          <Option value={'SE'}>SE</Option>
          <Option value={'BA'}>BA</Option>
          <Option value={'MA'}>MA</Option>
          <Option value={'PHD'}>PHD</Option>
        </Select>
      </Form.Item>

      <Form.Item label={'Main supervisor:'} required={true}>
        <Select
          className='maxWidth'
          placeholder='select main supervisor'
          onChange={handleChangeMain}
        >
          { supervisors.supervisors && supervisors.supervisors.map((value) => {
            // eslint-disable-next-line react/jsx-key
            return <Option value={value._id}>{value.slug}</Option>
          })
          }
        </Select>

      </Form.Item>

      <Form.Item label={'Co supervisor'}>
        <Select
          className='maxWidth'
          placeholder='select at least one supervisor'
          onChange={handleChangeCo}
        >
          { supervisors.supervisors && supervisors.supervisors.map((value) => {
            // eslint-disable-next-line react/jsx-key
            return <Option value={value._id}>{value.slug}</Option>
          })
          }
        </Select>
      </Form.Item>

      <Form.Item label={'Type'} required={true}>
        <Select
          className='maxWidth'
          placeholder='Select Type'
          onChange={TYPECHANGE}
        >
          <Option value={'accepted'}>accepted</Option>
          <Option value={'registered'}>registered</Option>
          <Option value={'defended'}>defended</Option>
        </Select>
      </Form.Item>

      <Form.Item label={'Curriculums'} name={'curriculums'} required={true}>
        <Select
          mode='multiple'
          className='maxWidth'
          placeholder='select one curriculum'
        >
          { curriculums.curriculums && (
            curriculums.curriculums.map((value) => {
              return value.collection.map((value2) => {
                // eslint-disable-next-line react/jsx-key
                return <Option value={value2._id}>{value2.names.et}</Option>
              })
            })
          )
          }
        </Select>
      </Form.Item>

      <Form.Item >
        <Button type='primary' htmlType='submit'>Submit</Button>
      </Form.Item>
    </Form>
  )
}

export default connect(() => {
}, {createTopic, getSupervisors, getCurriculums})(SupervisorNewTopic)
