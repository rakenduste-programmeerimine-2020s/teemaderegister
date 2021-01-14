import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import setUrl from '../utils/setUrl'
import { Menu, Dropdown, Form, Input, Layout } from 'antd'

const Search = Input.Search
const { Header } = Layout

const { arr, bool, func, object, shape, string } = PropTypes

const propTypes = {
  auth: shape({
    isAuthenticated: bool.isRequired,
    user: shape({
      profile: shape({
        firstName: string,
        lastName: string,
        slug: string,
        image: shape({
          full: string
        })
      }).isRequired,
      login: shape({
        roles: arr
      }).isRequired,
      updatedAt: string.isRequired
    }).isRequired
  }).isRequired,
  getSearchCounts: func.isRequired,
  history: object.isRequired,
  logout: func.isRequired,
  search: object.isRequired,
  setSearch: func.isRequired
}

class HeaderWrap extends Component {
  constructor (props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this)

    this.defaultSearch = ''
    const { q } = queryString.parse(props.history.location.search)
    if (q) {
      props.setSearch(q)
      this.defaultSearch = q
    }

    this.rolesMap = {
      'admin': 'Admin',
      'curriculum-manager': 'Curriculum manager',
      'head-of-study': 'Head of study',
      'student': 'Student',
      'study-assistant': 'Study assistant',
      'supervisor': 'Supervisor'
    }

    this.formRef = React.createRef()
  }

  // Disable update on every simple change
  // shouldComponentUpdate(nextProps) {
  //   const authChanged = this.props.auth.user !== nextProps.auth.user
  //   return authChanged
  // }

  UNSAFE_componentWillUpdate (nextProps) {
    // remove searchword if removed from props
    if (this.props.search.q && !nextProps.search.q) {
      this.formRef.current.setFieldsValue({ searchField: '' })
    }
  }

  componentDidMount () {
    if (this.defaultSearch) {
      this.props.getSearchCounts(this.defaultSearch)
      this.formRef.current.setFieldsValue({
        searchField: this.defaultSearch
      })
    }
  }

  handleSearch (value) {
    this.props.getSearchCounts(value)
    setUrl(
      this.props.history.replace,
      '/search',
      Object.assign(queryString.parse(this.props.history.location.search), {
        q: value
      })
    )
  }

  dropdownMenu ({ roles, slug, fullName }) {
    const isSupervisor = roles && roles.includes('supervisor')

    return (
      <Menu className='headerWrapDropdownMenu'>
        <Menu.Item className='noHover user-info'>
          <span className='user-name'>{fullName}</span>
          <ul className='user-roles'>
            {roles.map((role, index) => (
              <li key={index} >{this.rolesMap[role]}</li>
            ))}
          </ul>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link className='dashboard-link' to='/admin'>
            <i className='anticon anticon-pie-chart icon--15'></i> Dashboard
          </Link>
        </Menu.Item>
        <Menu.Divider />
        {isSupervisor &&
          <Menu.Item>
            <Link to={ '/supervisor/' + slug }>
              <i className='anticon anticon-user icon--15'></i> Profile
            </Link>
          </Menu.Item>}
        <Menu.Item>
          <Link to='/settings/account'>
            <i className='anticon anticon-setting icon--15'></i> Settings
          </Link>
        </Menu.Item>
        <Menu.Item>
          <span className='link' onClick={this.props.logout}>
            <i className='anticon anticon-logout icon--15'></i> Logout
          </span>
        </Menu.Item>
      </Menu>
    )
  }

  render () {
    const {
      auth: {
        isAuthenticated,
        user: {
          profile: { firstName, lastName, slug, image },
          login: { roles },
          updatedAt
        }
      }
    } = this.props

    const userImage = image
      ? `url(${process.env.UPLOAD_PATH + image.thumb}?updatedAt=${updatedAt})`
      : 'none'

    return (
      <Header className='headerWrap'>
        <div className='headerWrap__wrapper'>
          <Link to='/'>
            <div className='logo'>TeRe</div>
          </Link>
          <div className='content'>
            <Form ref={this.formRef} className='search' name='searchField'>
              <Search
                className='search__input'
                size='large'
                placeholder='Search by title, author or supervisor'
                defaultValue={this.defaultSearch}
                onSearch={this.handleSearch}
              />
            </Form>
            {isAuthenticated &&
              <div className='navigationWrap'>
                <Dropdown
                  className='userDropdown'
                  placement='bottomRight'
                  trigger={['click']}
                  overlay={this.dropdownMenu({
                    roles,
                    slug,
                    fullName: firstName + ' ' + lastName
                  })}
                >
                  <div className='userDropdown--icon' style={{backgroundImage: userImage}} />
                </Dropdown>
              </div>}
            {!isAuthenticated &&
              <div className='login'>
                <Link to='/login'>Sign in</Link>
              </div>}
          </div>
        </div>
      </Header>
    )
  }
}

HeaderWrap.propTypes = propTypes

export default HeaderWrap
