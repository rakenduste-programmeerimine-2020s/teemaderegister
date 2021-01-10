import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import {getSupervisorTopics} from '../actions/SupervisorActions'
import {setDocTitle} from '../utils/Helpers'
import {Table, Tag} from 'antd'

const TopicTable = (props) => {
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        setDocTitle(props.title)
        const fetchData = async () => {
            const fetchTableData = await props.getSupervisorTopics({search: props.title})
            setTableData(fetchTableData)
        }

        fetchData()
        // eslint-disable-next-line react/prop-types
    }, [props.title])

    const columns = [
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

    return (
        <div>
            <Table dataSource={tableData} columns={columns} />
        </div>
    )
}

export default connect(() => {
}, {getSupervisorTopics})(TopicTable)
