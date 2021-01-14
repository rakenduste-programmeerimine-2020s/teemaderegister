import React from 'react'
import { PropTypes } from 'prop-types'

import TableContentTopics from './TableContentTopics'
import TableContentSupervisors from './TableContentSupervisors'
import { Table } from 'antd'

const { bool, func, object, shape, string } = PropTypes

const propTypes = {
  curriculum: object,
  handleTableChange: func.isRequired,
  supervisor: object,
  tableContent: shape({
    loading: bool.isRequired,
    supervisors: object.isRequired,
    topics: object.isRequired
  }).isRequired,
  tableKey: string.isRequired
}

class TableContent extends React.Component {
  constructor (props) {
    super(props)

    this.columnsMap = {
      topics: TableContentTopics,
      supervisors: TableContentSupervisors
    }
  }

  render () {
    const {
      curriculum,
      handleTableChange,
      supervisor,
      tableContent,
      tableContent: { loading },
      tableKey
    } = this.props

    const {
      data,
      count,
      query: { sub, page, columnKey, order, types, curriculums, q }
    } = tableContent[tableKey]

    const { meta: { names, type } } = curriculum || { meta: {} }

    const currentPage = page ? parseInt(page) : 1

    const pagination = {
      current: currentPage,
      pageSize: 20,
      size: '',
      total: count[sub] || 0
    }

    const Columns = this.columnsMap[tableKey]

    return (
      <Table
        className='tableContent'
        bordered
        columns={Columns({
          // for creating columns
          sub,
          names,
          supervisor,
          type,

          // sort
          columnKey,
          order,

          // filters
          types,
          curriculums,

          // search highliht
          q
        })}
        dataSource={data}
        expandedRowRender={
          tableKey === 'topics' && sub === 'available'
            ? renderExpandedRow
            : false
        }
        loading={{ spinning: loading, delay: 200 }}
        onChange={handleTableChange}
        pagination={pagination}
        rowKey={r => r._id}
        size='small'
      />
    )
  }
}
const renderExpandedRow = record => {
  return (
    <span>
      {record.description || '-'}
    </span>
  )
}

TableContent.propTypes = propTypes

export default TableContent
