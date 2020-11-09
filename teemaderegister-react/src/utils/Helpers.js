import { trackPageView } from './Analytics'

export const removeEmpty = obj => {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key])
  return obj
}

export const setDocTitle = title => {
  document.title = `${title} | Teemaderegister`
  trackPageView()
}

export const capitalizeFirstLetter = string => {
  return string[0].toUpperCase() + string.slice(1)
}
