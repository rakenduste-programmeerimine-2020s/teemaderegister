import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {getSupervisorTopics} from '../actions/SupervisorActions'
import { DownloadOutlined } from '@ant-design/icons'
import {setDocTitle} from '../utils/Helpers'
import {Button, Table, Tag} from 'antd'

const defaultColumns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
    },
    {
        title: 'Author',
        dataIndex: 'author',
        render: data => {
            return (`${data.firstName} ${data.lastName}`)
        }
    },
    {
        title: 'Types',
        dataIndex: 'types',
        render: data => {
            return (data.map((value) => {
                // eslint-disable-next-line react/jsx-key
                return <Tag color='blue'>{value}</Tag>
            }))
        }
    },
    {
        title: 'Registered',
        dataIndex: 'registered',
        render: data => {
            return (data.split('T')[0])
        }
    }
]

const defendedColumns = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
    },
    {
        title: 'Author',
        dataIndex: 'author',
        render: data => {
            return (`${data.firstName} ${data.lastName}`)
        }
    },
    {
        title: 'Types',
        dataIndex: 'types',
        render: data => {
            return (data.map((value) => {
                // eslint-disable-next-line react/jsx-key
                return <Tag color='blue'>{value}</Tag>
            }))
        }
    },
    {
        title: 'Defended',
        dataIndex: 'defended',
        key: 'defended',
        render: data => {
            return data.split('T')[0]
        }
    },
    {
        title: 'File',
        dataIndex: 'file',
        key: 'file',
        render: link => {
            return (
                <Button type='primary' icon={<DownloadOutlined />} href={link} />)
        }
    }
]

const TopicTable = (props) => {
    const [tableData, setTableData] = useState([])
    const [columns, setColumns] = useState([])
    // eslint-disable-next-line react/prop-types
    const title = props.title

    useEffect(() => {
        setDocTitle(title)
        const fetchData = async () => {
            const fetchTableData = await props.getSupervisorTopics({status: title})
            setTableData(fetchTableData)
            console.log(columns)
            if (title === 'defended') {
                setColumns(defendedColumns)
            } else {
                setColumns(defaultColumns)
            }
        }

        fetchData()
    }, [title, columns])

    return (
        <div>
            <Table dataSource={tableData} columns={columns}/>
        </div>
    )
}

export default connect(() => {
}, {getSupervisorTopics})(TopicTable)
