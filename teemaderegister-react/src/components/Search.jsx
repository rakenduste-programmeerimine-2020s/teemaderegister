import React from 'react'
import PropTypes from 'prop-types'

import Breadcrumbs from './Breadcrumbs'
import TableWrap from '../components/TableWrap'
import getTabs from '../utils/getTabs'

const { bool, func, object, shape } = PropTypes

const propTypes = {
  clearTableContent: func.isRequired,
  getTableContent: func.isRequired,
  history: object.isRequired,
  initSearch: func.isRequired,
  initTableContent: func.isRequired,
  search: shape({
    loading: bool.isRequired
  }).isRequired,
  supervisors: object.isRequired,
  tableContent: object.isRequired,
  topics: object.isRequired
}

class Search extends React.Component {
  componentWillUnmount () {
    // Reset all state params
    this.props.initTableContent()
    this.props.initSearch()
  }

  getCrumbs () {
    return [{ url: null, name: 'Search' }]
  }

  render () {
    const {
      clearTableContent,
      getTableContent,
      history,
      search,
      search: { loading },
      supervisors,
      tableContent,
      topics
    } = this.props

    return (
      <div className='search width--public-page'>
        {!loading &&
          <div>
            <Breadcrumbs crumbs={this.getCrumbs()} />
            <TableWrap
              tabs={getTabs({ topics, supervisors })}
              history={history}
              search={search}
              getTableContent={getTableContent}
              clearTableContent={clearTableContent}
              tableContent={tableContent}
            />
          </div>}
      </div>
    )
  }
}

Search.propTypes = propTypes

export default Search
