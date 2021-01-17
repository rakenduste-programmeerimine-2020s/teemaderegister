import React from 'react'
import PropTypes from 'prop-types'
import DownloadCSV from './DownloadCSV'
import Breadcrumbs from './Breadcrumbs'
import TableWrap from '../components/TableWrap'
import getTabs from '../utils/getTabs'
import CurriculumMeta from './CurriculumMeta'
import {Button, Result} from 'antd'
import {Link} from 'react-router-dom'

const { bool, func, object, shape } = PropTypes

const propTypes = {
  clearTableContent: func.isRequired,
  curriculum: shape({
    meta: object.isRequired,
    loading: bool.isRequired
  }).isRequired,
  getCurriculum: func.isRequired,
  getTableContent: func.isRequired,
  history: object.isRequired,
  initCurriculum: func.isRequired,
  initTableContent: func.isRequired,
  location: object.isRequired,
  match: object.isRequired,
  supervisors: object.isRequired,
  tableContent: object.isRequired,
  topics: object.isRequired
}

class Curriculum extends React.Component {
  componentDidMount() {
    this.props.getCurriculum()
  }

  componentWillUnmount() {
    // Reset all state params
    this.props.initCurriculum()
    this.props.initTableContent()
  }

  getCrumbs(name) {
    return [
      { url: null, name: 'Curriculum' },
      { url: this.props.location.pathname, name }
    ]
  }

  render() {
    const {
      clearTableContent,
      curriculum,
      curriculum: { meta, loading },
      getTableContent,
      supervisors,
      tableContent,
      topics
    } = this.props

    return (
      <div className='curriculum width--public-page'>

        {
          curriculum.error && <Result
            status='404'
            title='404'
            subTitle={curriculum.message}
            extra={<Button type='primary'><Link to='/'>Back Home</Link></Button>}
          />
        }

        {!loading &&
          <div>
            <Breadcrumbs crumbs={this.getCrumbs(meta.names.et)} />
            <CurriculumMeta meta={meta} />
            <TableWrap
              clearTableContent={clearTableContent}
              curriculum={curriculum}
              getTableContent={getTableContent}
              history={this.props.history}
              queryExtend={{ curriculumId: meta._id }}
              tabs={getTabs({ topics, supervisors })}
              tableContent={tableContent}
            />
          </div>}
      </div>
    )
  }
}

Curriculum.propTypes = propTypes

export default Curriculum
