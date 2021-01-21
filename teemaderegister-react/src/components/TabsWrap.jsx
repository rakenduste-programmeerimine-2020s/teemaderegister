import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import TableContent from '../components/TableContent'
import { Tabs, Radio } from 'antd'
import DownloadCSV from './DownloadCSV'
import AddTopicButton from './AddTopicButton'
const { func, object, string } = PropTypes

const propTypes = {
  activeSub: string,
  activeTab: string,
  curriculum: object,
  handleTableChange: func.isRequired,
  supervisor: object,
  tabUpdated: func.isRequired,
  tableContent: object.isRequired,
  tabs: object.isRequired
}

class TabsWrap extends Component {
  constructor (props) {
    super(props)

    this.updateTabs = this.updateTabs.bind(this)
    this.tabClicked = this.tabClicked.bind(this)
  }

  createTabPanes (curriculum, handleTableChange, supervisor, tableContent, tabs) {
    return Object.keys(tabs).map(key => {
      const { title, icon, count, subs } = tabs[key]
      return (
        <Tabs.TabPane tab={this.createTabTitle(icon, title, count)} key={key}>
          {this.createSubTabs(subs)}
          <AddTopicButton {...this.props}/>
          <DownloadCSV {...this.props} />
          <TableContent
            curriculum={curriculum}
            handleTableChange={handleTableChange}
            supervisor={supervisor}
            tableContent={tableContent}
            tableKey={key}
          />
        </Tabs.TabPane>
      )
    })
  }

  createSubTabs (subs) {
    const { activeSub, curriculum } = this.props

    subs = Object.keys(subs).map(key => {
      const { title, count } = subs[key]
      return (
        <Radio.Button
          disabled={curriculum && curriculum.meta.closed && title !== 'Defended'}
          value={key}
          key={key}
        >
          {this.createSubTitle(title, count)}
        </Radio.Button>
      )
    })

    return (
      <Radio.Group value={activeSub} onChange={this.updateTabs}>
        {subs}
      </Radio.Group>
    )
  }

  createTabTitle (Icon, title, count) {
    return (
      <span>
        <Icon />
        {title} {count > 0 && '| ' + count}
      </span>
    )
  }

  createSubTitle (title, count) {
    return (
      <span>
        {title} {count > 0 && '| ' + count}
      </span>
    )
  }
  tabClicked (e) {
    // clear filters
    // tab - e
    const { activeTab, tabs, tabUpdated } = this.props
    // tab updated
    if (activeTab === e) { return tabUpdated([activeTab, tabs[activeTab].defaultSub]) }
  }
  updateTabs (e) {
    // tab - e
    // sub - e.target.value
    const { tabs, activeTab, tabUpdated } = this.props
    const subUpdated = e.target && e.target.value ? e.target.value : false

    const newTab = subUpdated ? activeTab : e
    const newSub = subUpdated || tabs[newTab].defaultSub

    return tabUpdated([newTab, newSub])
  }

  render () {
    const {
      curriculum,
      handleTableChange,
      supervisor,
      tableContent,
      tabs,
      activeTab
    } = this.props

    return (
      <Tabs
        animated={{ tabPane: false }}
        onChange={this.updateTabs}
        defaultActiveKey={activeTab}
        onTabClick={this.tabClicked}
      >
        {this.createTabPanes(
          curriculum,
          handleTableChange,
          supervisor,
          tableContent,
          tabs
        )}
      </Tabs>
    )
  }
}

TabsWrap.propTypes = propTypes

export default TabsWrap
