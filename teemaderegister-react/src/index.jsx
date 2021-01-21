import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Route, Switch, BrowserRouter, browserHistory, Link } from 'react-router-dom'
import { GithubOutlined } from '@ant-design/icons'

import {
  INDEX_PATH,
  LOGIN_PATH,
  CURRICULUM_ADD_PATH,
  CURRICULUM_PATH,
  SEARCH_PATH,
  SUPERVISOR_PATH,
  ADMIN_PATH,
  ACCOUNT_FORGOT,
  ACCOUNT_PASSWORD,
  SETTINGS_ACCOUNT_PATH,
  SETTINGS_PASSWORD_PATH,
  TOS_PATH,
  SETTINGS_2FA_PATH
} from './constants/RouterConstants'

import CurriculumContainer from './containers/CurriculumContainer'
import HeaderWrapContainer from './containers/HeaderWrapContainer'
import HomeContainer from './containers/HomeContainer'
import LoginContainer from './containers/LoginContainer'
import NotFound from './components/NotFound'
import RouteWrapContainer from './containers/RouteWrapContainer'
import SupervisorContainer from './containers/SupervisorContainer'
import SearchContainer from './containers/SearchContainer'
import AdminContainer from './containers/AdminContainer'
import AccountForgotContainer from './containers/AccountForgotContainer'
import AccountPasswordContainer from './containers/AccountPasswordContainer'
import SettingsAccountContainer from './containers/SettingsAccountContainer'
import SettingsPasswordContainer from './containers/SettingsPasswordContainer'
import TermsOfServiceContainer from './containers/TermsOfServiceContainer'
import CurriculumAddContainer from './containers/CurriculumAddContainer'
import Settings2faContainer from './containers/Settings2faContainer'
import TopicAddContainer from './containers/TopicAddContainer'

import store from './store/configureStore'
import { initAnalytics } from './utils/Analytics'

import './fonts' // antd fonts
import './media/favicons' // favicons
import './styles/main.scss' // all css

import { ConfigProvider, Layout } from 'antd'
import etEE from 'antd/lib/locale-provider/et_EE'

const { Content, Footer } = Layout

const links = {
  project: 'https://github.com/rakenduste-programmeerimine-2020s/teemaderegister',
  license: 'https://opensource.org/licenses/mit-license.html',
  content: 'https://www.tlu.ee'
}

initAnalytics()

render(
  <Provider store={store}>
    <BrowserRouter history={browserHistory}>
      <ConfigProvider locale={etEE}>
        <Layout className='layout'>
          <Route component={HeaderWrapContainer} />
          <Content>
            <div className='layout__content'>
              <Switch>
                <Route exact path={INDEX_PATH} component={
                  RouteWrapContainer(props => <HomeContainer {...props} />)
                } />
                <Route exact path={LOGIN_PATH} component={
                  RouteWrapContainer(props => <LoginContainer {...props} />)
                } />
                <Route path={SEARCH_PATH} component={
                  RouteWrapContainer(props => <SearchContainer {...props} />)
                } />
                <Route path={CURRICULUM_ADD_PATH} component={
                  RouteWrapContainer(props => <CurriculumAddContainer {...props} />, { restrict: true })
                } />
                <Route path={CURRICULUM_PATH} component={
                  RouteWrapContainer(props => <CurriculumContainer {...props} />)
                } />
                <Route path={SUPERVISOR_PATH} component={
                  RouteWrapContainer(props => <SupervisorContainer {...props} />)
                } />
                <Route path={ADMIN_PATH} component={
                  RouteWrapContainer(props => <AdminContainer {...props} />, {restrict: true})
                } />
                <Route path={SETTINGS_ACCOUNT_PATH} component={
                  RouteWrapContainer(props => <SettingsAccountContainer {...props} />, {restrict: true})
                } />
                <Route path={SETTINGS_PASSWORD_PATH} component={
                  RouteWrapContainer(props => <SettingsPasswordContainer {...props} />, {restrict: true})
                } />
                <Route path={ACCOUNT_FORGOT} component={
                  RouteWrapContainer(props => <AccountForgotContainer {...props} />)
                } />
                <Route path={ACCOUNT_PASSWORD} component={
                  RouteWrapContainer(props => <AccountPasswordContainer {...props} />)
                } />
                <Route path={TOS_PATH} component={
                  RouteWrapContainer(props => <TermsOfServiceContainer {...props} />)
                } />
                <Route path={SETTINGS_2FA_PATH} component={
                  RouteWrapContainer(props => <Settings2faContainer {...props} />, {restrict: true})
                } />
                <Route path={TOPIC_ADD_PATH} component={
                  RouteWrapContainer(props => <TopicAddContainer {...props} />, {restrict: true})
                } />
                <Route component={
                  RouteWrapContainer(props => <NotFound {...props} />)
                } />
              </Switch>
            </div>
          </Content>
          <Footer className='layout__footer'>
            <a href={links.project}> Teemaderegister</a><br/>
            <a href={links.project}><GithubOutlined /> Teemaderegister</a><br/>
            Code licensed under <a href={links.license}>MIT License</a><br/>
            Content © 2010-{new Date().getFullYear()} <a href={links.content}>Tallinn University</a>
            <Link to={TOS_PATH}>Terms of Service</Link>
          </Footer>
        </Layout>
      </ConfigProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('main')
)
