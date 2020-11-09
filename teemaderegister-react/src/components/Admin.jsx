import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu } from 'antd'
import { BookOutlined, LaptopOutlined, UserOutlined } from '@ant-design/icons'
import AdminConfirmations from './AdminConfirmations'
import AdminTopics from './AdminTopics'
import AdminUsers from './AdminUsers'
import setUrl from '../utils/setUrl'

const { SubMenu } = Menu
const { Content, Sider } = Layout

const { object, func, shape, arr } = PropTypes

const propTypes = {
  auth: shape({
    user: shape({
      login: shape({
        roles: arr
      }).isRequired
    }).isRequired
  }).isRequired,
  history: shape({
    replace: func.isRequired
  }).isRequired,
  match: shape({
    params: object
  })
}

class Admin extends React.Component {
  constructor (props) {
    super(props)

    this.Views = {
      registered: <AdminTopics type='registered' />,
      available: <AdminTopics type='available' />,
      defended: <AdminTopics type='defended' />,
      confs: <AdminConfirmations />,
      supervisors: <AdminUsers type='supervisor' />,
      students: <AdminUsers type='students' />
    }

    this.defaultPage = 'registered'
    const page = Object.keys(this.Views)[props.match.params.page] || this.defaultPage
    this.state = { page, collapsed: false }

    this.updateUrl = this.updateUrl.bind(this)
    this.onCollapse = this.onCollapse.bind(this)
    this.onSelect = this.onSelect.bind(this)
  }

  updateUrl (page) {
    const newUrl = '/admin/' + page
    setUrl(this.props.history.replace, newUrl)
  }

  onCollapse (collapsed) {
    this.setState({ collapsed })
  }

  onSelect (info) {
    const page = info.selectedKeys[0]
    this.setState({ page }, () => {
      this.updateUrl(page)
    })
  }

  render () {
    const { page } = this.state
    const Page = this.Views[page] || this.Views[this.defaultPage]
    const { auth: { user: { login: { roles } } } } = this.props

    const isAdmin = roles && roles.includes('admin')
    const isStudyAssistant = roles && roles.includes('study-assistant')

    return (
      <div className='Admin width--admin-page'>
        <Layout>
          <Layout>
            <Sider
              breakpoint='md'
              collapsedWidth='0'
              onCollapse={this.onCollapse}
              className='Admin__sidebar'
            >
              <Menu
                className='Admin__sidebar__menu'
                mode='inline'
                defaultSelectedKeys={[page]}
                defaultOpenKeys={['topics', 'users']}
                onSelect={this.onSelect}>
                <SubMenu key='topics' title={<span><BookOutlined />Topics</span>}>
                  <Menu.Item key='registered'>Registered</Menu.Item>
                  <Menu.Item key='available'>Available</Menu.Item>
                  <Menu.Item key='defended'>Defended</Menu.Item>
                </SubMenu>
                <Menu.Item key='confs'>
                  <LaptopOutlined />
                  <span>Confirmation</span>
                </Menu.Item>
                {(isAdmin || isStudyAssistant) &&
                  <SubMenu key='users' title={<span><UserOutlined />Users</span>}>
                    <Menu.Item key='supervisors'>Supervisors</Menu.Item>
                    <Menu.Item key='students'>Students</Menu.Item>
                  </SubMenu>
                }
              </Menu>
            </Sider>
            <Layout className='Admin__layout'>
              <Content className='Admin__layout__content'>
                {Page}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>)
  }
}

Admin.propTypes = propTypes

export default Admin
