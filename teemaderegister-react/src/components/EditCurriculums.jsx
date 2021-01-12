import React, {useEffect, useState} from 'react'
import {Button, Layout, Table, Modal, Select, Form, Checkbox, notification, Tag} from 'antd'
import {connect} from 'react-redux'
import {getCurriculums, getUsers, UpdateCurriculum} from '../actions/AdminActions'
import {setDocTitle} from '../utils/Helpers'

const EditCurriculums = (props) => {
  const [tableData, setTableData] = useState()
  const [usersData, setUsersData] = useState()
  const [curriculumData, setCurriculumData] = useState('')
  const [language, setLanguage] = useState('en')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { Option } = Select

  const columns = [
    {
      title: 'Edit',
      key: 'abbreviation',
      // eslint-disable-next-line react/display-name
      render: data => <Button onClick={() => {
        setCurriculumData(data)
        showModal()
      }
      }>Edit</Button>

    },
    {
      title: 'Is closed',
      dataIndex: 'closed',
      key: 'closed',
      // eslint-disable-next-line react/display-name
      render: data => {
        console.log(data)
        if (!data) return <Tag color={'lime'}>Open</Tag>
        return (<Tag color={'red'}>Closed</Tag>)
      }
    },
    {
      title: 'Representative name',
      dataIndex: 'representative_name',
      key: 'representative_name'
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty',
      key: 'faculty'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Names',
      key: 'names',
      dataIndex: 'names',
      // eslint-disable-next-line react/display-name
      render: text => <a>{text[language]}</a>
    },
    {
      title: 'Slugs',
      key: 'slugs',
      dataIndex: 'slugs',
      // eslint-disable-next-line react/display-name
      render: text => <a>{text[language]}</a>
    }
  ]

  useEffect(() => {
    setDocTitle('Edit curriculums')
    const fetchData = async () => {
      const fetchCurriculums = await props.getCurriculums()
      setTableData(fetchCurriculums)
      const fetchUsers = await props.getUsers()
      setUsersData(fetchUsers)
    }

    fetchData()
  }, [ curriculumData ])

  const reloadData = async () => {
    // eslint-disable-next-line react/prop-types
    const fetch = await props.getCurriculums()
    setTableData(fetch)
  }

  const generateCurriculum = () => {
    if (usersData) {
      return (
        <Form
          name='basic'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>
          <Form.Item
            label='curriculum owner'
            name='userId'
          >
            <Select
              style={{width: '100%'}}
              placeholder={curriculumData.representative_name}
            >
              {usersData.map((value) => {
                return <Option key={value._id}>{value.profile.slug}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item name='closed' valuePropName='checked'>
            <Checkbox>Close curriculum</Checkbox>
          </Form.Item>
          <Form.Item >
            <Button type='primary' htmlType='submit'>
                Submit
            </Button>
          </Form.Item>
        </Form>

      )
    }
  }

  function changeLanguage () {
    setLanguage(() => {
      if (language === 'en') return 'et'
      return 'en'
    })
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onFinish = async (values) => {
    console.log('Success:', values)
    values.curriculum_id = curriculumData._id
    // eslint-disable-next-line react/prop-types
    const updated = await props.UpdateCurriculum(values)
    if (updated.error) return notification.error({message: updated.message})
    notification.success({message: updated.message})
    reloadData()
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <Layout>
      <Table dataSource={tableData} columns={columns} />
      <Button onClick={changeLanguage}>Change language</Button>
      <Modal title='Edit Curriculum' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {
          generateCurriculum()
        }
      </Modal>
    </Layout>
  )
}

export default connect(() => {
}, {getCurriculums, getUsers, UpdateCurriculum})(EditCurriculums)
