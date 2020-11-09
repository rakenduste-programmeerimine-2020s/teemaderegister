import React from 'react'
import { connect } from 'react-redux'

import Search from '../components/Search'
import {
  clearTableContent,
  initTableContent,
  getTableContent
} from '../actions/TableContentActions'
import { initSearch } from '../actions/SearchActions'

const SearchContainer = props => <Search {...props} />

const mapStateToProps = state => ({
  search: state.search,
  supervisors: state.tableContent.supervisors,
  tableContent: state.tableContent,
  topics: state.tableContent.topics
})

export default connect(mapStateToProps, {
  clearTableContent,
  getTableContent,
  initSearch,
  initTableContent
})(SearchContainer)
