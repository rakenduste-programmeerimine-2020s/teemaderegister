import ReactGA from 'react-ga'

export const initAnalytics = () => {
  if (!process.env.GA_ENABLED) return
  ReactGA.initialize(process.env.GA_CODE)
}

module.exports.trackPageView = (obj = {}) => {
  if (!process.env.GA_ENABLED) return
  ReactGA.set({ page: window.location.pathname + window.location.search })
  ReactGA.pageview(window.location.pathname + window.location.search)
}
