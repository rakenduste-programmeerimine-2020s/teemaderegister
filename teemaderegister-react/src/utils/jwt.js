export const clearToken = () => localStorage.removeItem('jwtToken')
export const getToken = () => localStorage.jwtToken
export const setToken = token => localStorage.setItem('jwtToken', token)
