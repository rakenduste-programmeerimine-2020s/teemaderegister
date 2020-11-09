import React from 'react'
import { PropTypes } from 'prop-types'
import queryString from 'query-string'

import { removeEmpty, setDocTitle, capitalizeFirstLetter } from '../utils/Helpers'
import setUrl from '../utils/setUrl'
import TabsWrap from './TabsWrap'

const { func, object, shape, string } = PropTypes

const propTypes = {
  clearTableContent: func.isRequired,
  curriculum: object,
  defaultTab: string,
  getTableContent: func.isRequired,
  history: shape({
    replace: func.isRequired,
    location: shape({
      pathname: string.isRequired,
      search: string.isRequired
    }).isRequired
  }).isRequired,
  queryExtend: object,
  search: object,
  supervisor: object,
  tableContent: object.isRequired,
  tabs: object.isRequired
}

class TableWrap extends React.Component {
  constructor (props) {
    super(props)

    this.tabs = props.tabs
    this.defaultTab = props.defaultTab || 'topics'
    this.queryExtend = props.queryExtend || {}

    let {
      tab,
      sub,

      // search
      q,

      // pagination
      page,

      // sort
      columnKey,
      order,

      // all allowed filters
      types,
      curriculums
    } = queryString.parse(props.history.location.search, {
      arrayFormat: 'bracket'
    })

    this.defaultPage = 1
    page = page || this.defaultPage

    // Fix limit to only available subs and tabs
    tab = tab && this.tabs[tab] ? tab : this.defaultTab
    const tabObj = this.tabs[tab]

    sub = sub && tabObj.subs[sub] ? sub : tabObj.sub
    // Select defended sub for closed curriculums
    sub = (props.curriculum && props.curriculum.meta.closed)
      ? 'defended'
      : sub

    const subObj = tabObj.subs[sub]
    columnKey = columnKey || subObj.columnKey

    // Set titles depending on page, search title updated on componentWillUpdate
    this.curriculumTitle = this.props.curriculum && this.props.curriculum.meta.names.en
    this.supervisorTitle = this.props.supervisor &&
      this.props.supervisor.data.profile.firstName + ' ' + this.props.supervisor.data.profile.lastName

    // FIX default ascend if not in url but there is columnKey
    this.defaultOrder = 'ascend'
    order = order || subObj.order

    this.state = {
      tab,
      sub,
      q,
      page,
      columnKey,
      order,
      types,
      curriculums
    }

    this.tabUpdated = this.tabUpdated.bind(this)
    this.handleTableChange = this.handleTableChange.bind(this)
  }

  componentDidMount () {
    this.makeQuery()
    this.setPageTitle()
  }

  UNSAFE_componentWillUpdate (nextProps) {
    // trigger content load on new searchword
    // make search query and override state q
    if (nextProps.search && nextProps.search.q !== this.props.search.q) {
      this.tabs = nextProps.tabs // update tabs count
      this.setState({ q: nextProps.search.q }, () => {
        this.makeQuery({ showLoading: true }, { q: nextProps.search.q })
        this.setPageTitle()
      })
    }
  }

  getDefaults ({ tab, sub }) {
    const tabObj = this.tabs[tab]
    sub = sub || tabObj.sub
    const { columnKey, order } = tabObj.subs[sub]

    return {
      sub,
      columnKey,
      order,
      page: this.defaultPage,
      types: undefined,
      curriculums: undefined
    }
  }

  makeQuery (showLoading, q) {
    // dont do query if no count
    const { tab, sub } = this.state
    const query = Object.assign(this.queryExtend, this.state, q)

    if (this.tabs[tab].subs[sub].count === 0) {
      // create object to only clear active tab data
      const obj = {}
      obj[tab] = true
      return this.props.clearTableContent(query)
    }

    this.props.getTableContent(query, showLoading || false)
  }

  setPageTitle () {
    const searchTitle = this.props.search && (
      this.state.q
        ? `${this.state.q} - Search`
        : 'Search'
    )
    const title = searchTitle || this.curriculumTitle || this.supervisorTitle
    const pageTitle = `${title} ${capitalizeFirstLetter(this.state.tab)}`
    setDocTitle(pageTitle)
  }

  tabUpdated ([tab, sub]) {
    const newState = Object.assign({ tab }, this.getDefaults({ tab, sub }))
    const showLoading = true

    this.setState(newState, () => {
      this.writeURL()
      this.makeQuery(showLoading)
      this.setPageTitle()
    })
  }

  writeURL () {
    const { history: { replace, location: { pathname } } } = this.props
    const { tab, sub, columnKey } = this.state

    // FIX overwrite sub to be default sub no matter what,
    // to preserve other subs in url
    let defaults = this.getDefaults({ tab, sub })
    defaults = Object.assign(defaults, {
      tab: this.defaultTab,
      sub: this.tabs[tab].sub,
      order:
        columnKey === defaults.columnKey ? defaults.order : this.defaultOrder
    })

    setUrl(replace, pathname, this.state, defaults)
  }

  handleTableChange (pagination, filters, sorter) {
    const { columnKey, order } = sorter
    const page = pagination.current
    const { types, curriculums } = removeEmpty(filters)
    const showLoading = true

    this.setState({ page, columnKey, order, types, curriculums }, () => {
      this.writeURL()
      this.makeQuery(showLoading)
    })
  }

  render () {
    const { sub, tab } = this.state
    const {
      curriculum,
      supervisor,
      tableContent,
      tabs
    } = this.props

    return (
      <div className='tableWrap width--public-page'>
        <TabsWrap
          activeSub={sub}
          activeTab={tab}
          curriculum={curriculum}
          handleTableChange={this.handleTableChange}
          tabUpdated={this.tabUpdated}
          supervisor={supervisor}
          tableContent={tableContent}
          tabs={tabs}
        />
      </div>
    )
  }
}

TableWrap.propTypes = propTypes

export default TableWrap
